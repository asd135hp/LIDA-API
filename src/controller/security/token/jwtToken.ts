import { JwtPayload } from "jsonwebtoken";
import { jwtSign, jwtVerify } from "../../../utility/encryption";
import { BaseKey } from "./baseKey";

export class JWTKey extends BaseKey {
  generateToken(uid: string, apiKey: string): Buffer {
    const token = jwtSign({ uid, apiKey })
    return Buffer.from(token)
  }
  
  parseToken(token: string): JwtPayload {
    const payload = jwtVerify(token)
    return payload
  }
}