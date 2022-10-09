import { asymmetricKeyDecryption, asymmetricKeyEncryption } from "../../../utility/encryption";
import { BaseKey } from "./baseKey";

export class AESKey extends BaseKey {
  async getAPIKey(uid: string, renewalRetries = 3): Promise<string> {
    return await super.getAPIKey(uid, renewalRetries)
  }

  async validateKey(uid: string, apiKey: string): Promise<boolean> {
    return await super.validateKey(uid, apiKey)
  }

  async renewKey(
    uid: string,
    expiraryDateFromNow = 3600 * 24 * 30
  ): Promise<string> {
    return await super.renewKey(uid, expiraryDateFromNow)
  }

  generateToken(uid: string, apiKey: string) {
    // very buggy to say the least due to .final() method
    return asymmetricKeyEncryption(`${uid}|${apiKey}`)
  }

  parseToken(token: string) {
    return asymmetricKeyDecryption(Buffer.from(token, 'hex')).split("|")
  }
}