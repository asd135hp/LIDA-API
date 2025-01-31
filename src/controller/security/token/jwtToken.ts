import { JWTPayload } from "jose";
import { parseJWT, signJWT } from "../../../utility/encryption";
import { BaseKey } from "./baseKey";

export class JWTKey extends BaseKey {
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
    return Buffer.from(signJWT({ uid, apiKey }))
  }
  
  parseToken(token: string): JWTPayload {
    return parseJWT(token)
  }
}