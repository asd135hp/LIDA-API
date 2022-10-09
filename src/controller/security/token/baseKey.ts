import { randomBytes } from "crypto";
import { DateTime } from "luxon";
import { logger, DATABASE_TIMEZONE } from "../../../constants";
import FirebaseStorageFacade from "../../database/firebase/interfaces/firebaseStorageFacade";

// who don't like the dependency injection?
export abstract class BaseKey {
  protected storage: FirebaseStorageFacade;
  protected privilege: string;

  constructor(storage?: FirebaseStorageFacade);
  constructor(storage: FirebaseStorageFacade, privilege = "admin"){
    this.storage = storage
    this.privilege = privilege
  }

  private checkStorage(){
    if(!this.storage) return Promise.reject({
      message: "Cannot get storage reference",
      type: "Basic Key"
    })
  }

  protected getAuthFilePath(email: string) { return `auth/user/${email}/api_token.json` }

  /**
   * 
   * @param uid 
   * @param renewalRetries 
   */
  async getAPIKey(uid: string, renewalRetries?: number): Promise<string> {
    this.checkStorage()

    const path = this.getAuthFilePath(uid)
    if(!await this.storage.isFileExists(path)) {
      // third time the charm, or else...
      if(renewalRetries === 3) return ""

      // try to renew the key since the account in the system
      // but there is a change in environment
      await this.renewKey(uid)
      return this.getAPIKey(uid, renewalRetries + 1)
    }

    const data = (await this.storage.readFileFromStorage(path)).toString()
    logger.info("APIKey - getKey: " + data)
    if(!data) return ""

    const json = JSON.parse(data)
    // admin priviledge, could be extended to handle multiple roles
    if(!json || !json[this.privilege]) return ""

    const keyInfo = json[this.privilege]
    // check expirary date
    if(keyInfo.expiraryDate <= DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()) return ""
    return keyInfo.apiKey
  }

  /**
   * 
   * @param uid 
   * @param apiKey 
   */
  async validateKey(uid: string, apiKey: string): Promise<boolean> {
    this.checkStorage()
    
    const storedAPIKey = await this.getAPIKey(uid)
    logger.warn("FirebaseAuthService - validateKey: Stored API key" + storedAPIKey)
    // check api key (could be more rigorous but this check could be good enough)
    return storedAPIKey === apiKey
  }

  /**
   * This forces key renewal immediately
   * @param uid
   * @param expiraryDateFromNow
   */
  async renewKey(uid: string, expiraryDateFromNow?: number): Promise<string> {
    this.checkStorage()
    
    // upload api key
    const apiKey = randomBytes(64).toString("base64")
    const data = (
      await this.storage.isFileExists(this.getAuthFilePath(uid)) &&
      (await this.storage.readFileFromStorage(this.getAuthFilePath(uid))).toString()
    ) || "{}"
    const json = JSON.parse(data)

    // renew necessary section for validation
    json[this.privilege] = {
      expirary: DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger() + expiraryDateFromNow,
      apiKey
    }

    // upload new api key list
    logger.debug("FirebaseAuthService - reauth: " + JSON.stringify(json))
    return await this.storage.uploadBytesToStorage(this.getAuthFilePath(uid), JSON.stringify(json))
      .then(() => apiKey, () => "")
  }

  abstract generateToken(uid: string, apiKey: string): Buffer;

  abstract parseToken(token: string): any;
}

export enum KeySchema {
  JWT = "jwt",
  AES = "aes"
}