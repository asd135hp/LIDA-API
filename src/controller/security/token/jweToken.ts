import { JWTPayload } from "jose";
import { getJWE, parseJWE } from "../../../utility/encryption";
import { BaseKey } from "./baseKey";

export class JWEKey extends BaseKey {
  async getAPIKey(uid: string, renewalRetries = 3): Promise<string> {
    return await super.getAPIKey(uid, renewalRetries)
  }
  
  async renewKey(
    uid: string,
    expiraryDateFromNow = 3600 * 24 * 30
  ): Promise<string> {
    return await super.renewKey(uid, expiraryDateFromNow)
  }

  generateToken(uid: string, apiKey: string): Buffer {
    let result = ""
    getJWE({ uid, apiKey }).then(val => result = val)
    return Buffer.from(result)
  }
  
  parseToken(token: string): JWTPayload {
    let payload = {}
    parseJWE(token).then(val => payload = val)
    return payload
  }
}