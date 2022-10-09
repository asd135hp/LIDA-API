import firebaseAdmin from "firebase-admin";
import { App } from "firebase-admin/app";
import { Auth as AdminAuth } from "firebase-admin/auth";
import { initializeApp } from "firebase/app";
import { Auth as ClientAuth, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_CONFIG, logger, PROMISE_CATCH_METHOD } from "../../../../constants";
import User from "../../../../model/v1/auth/user";
import FirebaseAuthFacade from "../interfaces/firebaseAuthFacade";
import { randomInt, randomBytes } from "crypto";
import { BaseKey } from "../../../security/token/baseKey";

/**
 * WARNING: This authentication service is not, in anyway possible, secure.
 * However, it does not use cookie, which is a plus for REST API.
 * Use this service at your own risk or improve the service to handle authentication better
 */
export default class FirebaseAuthService implements FirebaseAuthFacade {
  private clientAuth: ClientAuth
  private adminAuth: AdminAuth
  private apiKey: BaseKey

  constructor(firebaseApp: App, apiKey: BaseKey){
    this.clientAuth = getAuth(initializeApp(
      FIREBASE_CONFIG,
      Array(10).fill(0).map(_ => String.fromCharCode(randomInt(65, 90))).join('')
    ))
    this.adminAuth = firebaseAdmin.auth(firebaseApp)
    this.apiKey = apiKey
  }

  async loginWithEmail(email: string, password: string): Promise<User> {
    return await signInWithEmailAndPassword(this.clientAuth, email, password)
      .then(async credentials => {
        let apiKey: string = ""

        try{
          apiKey = await this.apiKey.getAPIKey(credentials.user.uid)
        } catch(e) {
          apiKey = await this.apiKey.renewKey(credentials.user.uid)
        }
        
        logger.info("FirebaseAuthService - loginWithEmail: New user logged in!")
        let accessToken: Buffer = null
        if(apiKey){
          accessToken = this.apiKey.generateToken(credentials.user.uid, apiKey)
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
        await this.apiKey.renewKey(record.uid)
        logger.info("FirebaseAuthService - registerWithEmail: New user is registered")
      })
      .catch(PROMISE_CATCH_METHOD)
  }

  async reauthenticationWithEmail(email: string, password: string): Promise<User>{
    return await signInWithEmailAndPassword(this.clientAuth, email, password)
      .then(async credentials => {
        const apiKey = await this.apiKey.renewKey(credentials.user.uid)
        logger.info("FirebaseAuthService - reauthenticationWithEmail: New user logged in!")

        let accessToken: Buffer = null
        if(apiKey){
          accessToken = this.apiKey.generateToken(credentials.user.uid, apiKey)
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
    return this.apiKey.validateKey(uid, apiKey)
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
    if(!await this.apiKey.validateKey(uid, apiKey)) return

    await this.adminAuth.deleteUser(uid)
      .then(()=>logger.info(`User with uid ${uid} is deleted`))
      .catch(PROMISE_CATCH_METHOD)
  }

  logout(user: User){ user && !user.isLoggedOut && user.logOut() }
}