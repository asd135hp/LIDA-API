import { Request } from "express";
import { asymmetricKeyDecryption, jwtVerify } from "../../utility/encryption";
import { persistentFirebaseConnection } from "../v1/services/firebaseFreetier/firebaseService";
import FirebaseAuthService from "../database/firebase/services/firebaseAuthService";
import { BaseKey } from "../database/firebase/token/baseKey";
import { AESKey } from "../database/firebase/token/aesKey";
import { JWTKey } from "../database/firebase/token/jwtToken";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  let key: BaseKey;
  // to enhance the security of this application, scopes should be used to divide users into groups
  // that could use which service at a time
  if (securityName === "api_key") {
    let token = request.query?.accessToken
    key = new AESKey()

    if(!token) return Promise.reject({ message: "No authentication token is provided", type: "Security" })
    if(Array.isArray(token))
      return Promise.reject({
        message: "Wrong token format - only one token is needed",
        type: "Security"
      })

    const unpacked = key.parseToken(token.toString())
    if(unpacked.length != 2)
      return Promise.reject({
        message: "Wrong token format",
        type: "Security"
      })

    const [userId, apiKey] = unpacked
    const service = persistentFirebaseConnection.authService as FirebaseAuthService

    // could add scope to the path of the file to read
    return await service.verifyApiKey(userId, apiKey)
  }

  if(securityName === 'jwt') {
    let token = request.query?.accessToken
    key = new JWTKey()
    
    if(!token) return Promise.reject({ message: "No authentication token is provided", type: "Security" })
    if(Array.isArray(token))
      return Promise.reject({
        message: "Wrong token format - only one token is needed",
        type: "Security"
      })

    const unpacked = key.parseToken(token.toString())
    if(unpacked.length != 2)
      return Promise.reject({
        message: "Wrong token format",
        type: "Security"
      })

    const [userId, apiKey] = unpacked
    const service = persistentFirebaseConnection.authService as FirebaseAuthService

    // could add scope to the path of the file to read
    return await service.verifyApiKey(userId, apiKey)
  }
}