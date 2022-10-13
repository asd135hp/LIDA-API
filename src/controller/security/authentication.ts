import { Request } from "express";
import FirebaseAuthService from "../database/firebase/services/firebaseAuthService";
import { BaseKey, KeySchema } from "./token/baseKey";
import { AESKey } from "./token/aesKey";
import { JWTKey } from "./token/jwtToken";
import { JwtPayload } from "jsonwebtoken";
import { persistentAuthService } from "../v1/services/serviceEntries";

/**
 * Please extend this method since it is really insecure. Well, in the context of this project scope,
 * improving this seems unnecessary but it will become important later on.
 * @param request 
 * @param securityName 
 * @param scopes 
 * @returns 
 */
export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  const token = request.query?.accessToken
  if(!token) return Promise.reject({ message: "No authentication token is provided", type: "Security" })
  if(Array.isArray(token))
    return Promise.reject({
      message: "Wrong token format - only one token is needed",
      type: "Security"
    })

  // to enhance the security of this application, scopes should be used to divide users into groups
  // that could use which service at a time
  let key: BaseKey;
  if (securityName === KeySchema.AES) {
    key = new AESKey()

    const unpacked = key.parseToken(token.toString())
    if(unpacked.length != 2)
      return Promise.reject({
        message: "Wrong token format",
        type: "Security"
      })

    const [userId, apiKey] = unpacked
    const service = persistentAuthService as FirebaseAuthService

    // could add scope to the path of the file to read
    return await service.verifyApiKey(userId, apiKey)
  }

  if(securityName === KeySchema.JWT) {
    key = new JWTKey()

    const unpacked = key.parseToken(token.toString()) as JwtPayload
    if(typeof(unpacked) != 'object')
      return Promise.reject({
        message: "Wrong token format",
        type: "Security"
      })

    const { uid, apiKey } = unpacked
    const service = persistentAuthService as FirebaseAuthService
    // could add scope to the path of the file to read
    return await service.verifyApiKey(uid, apiKey)
  }
}