import { randomBytes } from "crypto";
import { DateTime } from "luxon";
import { logger, DATABASE_TIMEZONE } from "../../../../constants";
import { asymmetricKeyDecryption } from "../../../../utility/encryption";
import { BaseKey } from "./baseKey";

export class JWTKey extends BaseKey {
  async getAPIKey(uid: string, renewalRetries = 0): Promise<string>{
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

  async validateKey(uid: string, apiKey: string): Promise<boolean> {
    const storedAPIKey = await this.getAPIKey(uid)
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
    json[this.privilege] = {
      expirary: DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger() + expiraryDateFromNow,
      apiKey
    }

    // upload new api key list
    logger.debug("FirebaseAuthService - reauth: " + JSON.stringify(json))
    return await this.storage.uploadBytesToStorage(this.getAuthFilePath(uid), JSON.stringify(json))
      .then(() => apiKey, () => "")
  }

  generateToken(uid: string, apiKey: string): Buffer {
    throw new Error("Method not implemented.");
  }
  
  parseToken(token: string) {
    return asymmetricKeyDecryption(Buffer.from(token, 'hex'))
  }
}