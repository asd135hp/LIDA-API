import firebaseAdmin from "firebase-admin";
import { App } from "firebase-admin/app";
import { Auth as AdminAuth } from "firebase-admin/auth";
import { initializeApp } from "firebase/app";
import { Auth as ClientAuth, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { DATABASE_TIMEZONE, FIREBASE_CONFIG, logger, PROMISE_CATCH_METHOD } from "../../../../constants";
import User from "../../../../model/v1/auth/user";
import FirebaseAuthFacade from "../interfaces/firebaseAuthFacade";
import FirebaseStorageFacade from "../interfaces/firebaseStorageFacade";
import { DateTime } from "luxon";
import { randomInt, randomBytes } from "crypto";
import { asymmetricKeyDecryption, asymmetricKeyEncryption } from "../../../../utility/encryption";

class APIKey {
  private storage: FirebaseStorageFacade;
  private priviledge: string;

  constructor(storage: FirebaseStorageFacade, priviledge = "admin"){
    this.storage = storage
    this.priviledge = priviledge
  }

  private getAuthFilePath(email: string) { return `auth/user/${email}/api_key.json` }

  
  async getKey(uid: string, renewalRetries = 0): Promise<string>{
    const path = this.getAuthFilePath(uid)
    if(!await this.storage.isFileExists(path)) {
      // third time the charm, or else...
      if(renewalRetries === 3) return ""

      // try to renew the key since the account in the system
      // but there is a change in environment
      await this.renewKey(uid)
      return this.getKey(uid, renewalRetries + 1)
    }

    const data = (await this.storage.readFileFromStorage(path)).toString()
    logger.info("APIKey - getKey: " + data)
    if(!data) return ""

    const json = JSON.parse(data)
    // admin priviledge, could be extended to handle multiple roles
    if(!json || !json[this.priviledge]) return ""

    const keyInfo = json[this.priviledge]
    // check expirary date
    if(keyInfo.expiraryDate <= DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()) return ""
    return keyInfo.apiKey
  }

  async validateKey(uid: string, apiKey: string): Promise<boolean> {
    const storedAPIKey = await this.getKey(uid)
    logger.warn("FirebaseAuthService - validateKey: Stored API key" + storedAPIKey)
    // check api key (could be more rigorous but this check could be good enough)
    return storedAPIKey === apiKey
  }

  /**
   * This forces key renewal immediately
   */
  async renewKey(
    uid: string,
    expiraryDateFromNow = 3600 * 24 * 30
  ): Promise<string> {
    // upload api key
    const apiKey = randomBytes(64).toString("base64")
    const data = (
      await this.storage.isFileExists(this.getAuthFilePath(uid)) &&
      (await this.storage.readFileFromStorage(this.getAuthFilePath(uid))).toString()
    ) || "{}"
    const json = JSON.parse(data)

    // renew necessary section for validation
    json[this.priviledge] = {
      expirary: DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger() + expiraryDateFromNow,
      apiKey
    }

    // upload new api key list
    logger.debug("FirebaseAuthService - reauth: " + JSON.stringify(json))
    return await this.storage.uploadBytesToStorage(this.getAuthFilePath(uid), JSON.stringify(json))
      .then(() => apiKey, () => "")
  }
}

/**
 * WARNING: This authentication service is not, in anyway possible, secure.
 * However, it does not use cookie, which is a plus for REST API.
 * Use this service at your own risk or improve the service to handle authentication better
 */
export default class FirebaseAuthService implements FirebaseAuthFacade {
  private clientAuth: ClientAuth
  private adminAuth: AdminAuth
  private storage: FirebaseStorageFacade

  constructor(firebaseApp: App, storageFacade: FirebaseStorageFacade){
    this.clientAuth = getAuth(initializeApp(
      FIREBASE_CONFIG,
      Array(10).fill(0).map(_ => String.fromCharCode(randomInt(65, 90))).join('')
    ))
    this.adminAuth = firebaseAdmin.auth(firebaseApp)
    this.storage = storageFacade
  }

  async loginWithEmail(email: string, password: string): Promise<User> {
    return await signInWithEmailAndPassword(this.clientAuth, email, password)
      .then(async credentials => {
        const apiKeyObj = new APIKey(this.storage, "admin")
        let apiKey = await apiKeyObj.getKey(credentials.user.uid)

        try{
          asymmetricKeyDecryption(Buffer.from(apiKey, 'hex'))
        } catch(e) {
          apiKey = await apiKeyObj.renewKey(credentials.user.uid)
        }
        
        logger.info("FirebaseAuthService - loginWithEmail: New user logged in!")
        let accessToken: Buffer = null
        if(apiKey){
          accessToken = asymmetricKeyEncryption(`${credentials.user.uid}|${apiKey}`)
          return new User(credentials.user, accessToken)
        }
        
        return Promise.reject({
          message: "Authentication failed",
          reason: "Could not regenerate new API key"
        })
      })
  }

  async loginWithProvider(): Promise<User>{ return null }

  async registerWithEmail(email: string, password: string, redirectUrl?: string): Promise<void> {
    return await this.adminAuth.createUser({
      email,
      password,
      displayName: randomBytes(15).toString("base64")
    }).then(async record => {
        const apiKey = new APIKey(this.storage, "admin")
        await apiKey.renewKey(record.uid)
        logger.info("FirebaseAuthService - registerWithEmail: New user is registered")
      })
      .catch(PROMISE_CATCH_METHOD)
  }

  async reauthenticationWithEmail(email: string, password: string): Promise<User>{
    return await signInWithEmailAndPassword(this.clientAuth, email, password)
      .then(async credentials => {
        const apiKey = await new APIKey(this.storage, "admin").renewKey(credentials.user.uid)
        logger.info("FirebaseAuthService - reauthenticationWithEmail: New user logged in!")

        let accessToken: Buffer = null
        if(apiKey){
          accessToken = asymmetricKeyEncryption(`${credentials.user.uid}|${apiKey}`)
          return new User(credentials.user, accessToken)
        }
        
        return Promise.reject({
          message: "Reauthentication failed",
          reason: "Could not regenerate new API key"
        })
      })
  }

  async verifyApiKey(uid: string, apiKey: string): Promise<boolean> {
    logger.debug("FirebaseAuthService: Verifying API key")
    return new APIKey(this.storage, "admin").validateKey(uid, apiKey)
  }

  async updatePassword(user: User, newPassword: string): Promise<void> {
    // if(user?.isLoggedOut){
    //   logger.error("User is already logged out so API key validation failed")
    //   return Promise.reject("Please log in again to validate the API key")
    // }

    // // there should be a more secure way to update user info instead of relying on API keys
    // const apiKey = new APIKey(this.storage, "admin")
    // if(!await apiKey.validateKey(user.email, user.apiKey)) return

    // await this.adminAuth.updateUser(user.uid, { password: newPassword })
    //   .then(()=>logger.info("Updated successfully"))
    //   .catch(PROMISE_CATCH_METHOD)
  }

  // optional but necessary to implement
  async forgotPassword(){}

  async updateUser(user: User): Promise<User> {
    return null
    // if(user?.isLoggedOut){
    //   logger.error("User is already logged out so API key validation failed")
    //   return Promise.reject("Please log in again to validate the API key")
    // }

    // // there should be a more secure way to update user info instead of relying on API keys
    // const apiKey = new APIKey(this.storage, "admin")
    // if(!await apiKey.validateKey(user.email, user.apiKey)) return

    // await this.adminAuth.updateUser(user.uid, user.toUpdateRequest())
    //   .then(()=>logger.info(`User with email ${user.email} is updated successfully`))
    //   .catch(PROMISE_CATCH_METHOD)

    // return user
  }
  
  async deleteUser(uid: string, apiKey: string): Promise<void> {
    // there should be a more secure way to update user info instead of relying on API keys
    const key = new APIKey(this.storage, "admin")
    if(!await key.validateKey(uid, apiKey)) return

    await this.adminAuth.deleteUser(uid)
      .then(()=>logger.info(`User with uid ${uid} is deleted`))
      .catch(PROMISE_CATCH_METHOD)
  }

  logout(user: User){ user && !user.isLoggedOut && user.logOut() }
}