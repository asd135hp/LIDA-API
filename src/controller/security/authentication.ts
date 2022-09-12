import { Request } from "express";
import { asymmetricKeyDecryption } from "../../utility/encryption";
import { persistentFirebaseConnection } from "../v1/services/firebaseFreetier/firebaseService";
import FirebaseAuthService from "../database/firebase/services/firebaseAuthService";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  // to enhance the security of this application, scopes should be used to divide users into groups
  // that could use which service at a time
  if (securityName === "api_key") {
    let token = request.query?.accessToken

    if(!token) return Promise.reject({ message: "No authentication token is provided", type: "Security" })
    if(Array.isArray(token))
      return Promise.reject({
        message: "Wrong token format - only one token is needed",
        type: "Security"
      })

    const unpacked = asymmetricKeyDecryption(Buffer.from(token.toString(), 'hex')).split('|')
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