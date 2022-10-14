import { CompactEncrypt, JWTPayload, UnsecuredJWT, compactDecrypt, decodeJwt, importSPKI, importPKCS8, JWK } from 'jose'
import { createCipheriv, createDecipheriv } from "crypto"
import { JWT_PUBLIC_KEY, JWT_PRIVATE_KEY, RAW_CIPHER_IV, RAW_CIPHER_KEY, logger } from "../constants"

let authTag: Buffer = (()=>{
  let retries = 0
  while(retries < 10){
    try {
      const cipher = createCipheriv("aes-256-gcm", RAW_CIPHER_KEY, RAW_CIPHER_IV)
      cipher.final()
      return cipher.getAuthTag()
    } catch(e) {
      logger.error(`Asymmetric Key Decryption failed when setting auth tag with error: ${e}.\nStack trace: ${e.trace}` )
      retries++
    }
  }
  return null
})()

export function asymmetricKeyEncryption(data: string): Buffer {
  const cipher = createCipheriv("aes-256-gcm", RAW_CIPHER_KEY, RAW_CIPHER_IV)
  const updateBuffer = cipher.update(data)
  const finalBuffer = cipher.final()
  const buffer = Buffer.concat([updateBuffer, finalBuffer])
  authTag = cipher.getAuthTag()
  return buffer
}

function decipher(data: Buffer, autoPadding: boolean) {
  const decipher = createDecipheriv("aes-256-gcm", RAW_CIPHER_KEY, RAW_CIPHER_IV)
  
  decipher.setAutoPadding(autoPadding)
  decipher.setAuthTag(authTag)

  const updateBuffer = decipher.update(data)
  const finalBuffer = decipher.final()
  return Buffer.concat([updateBuffer, finalBuffer]).toString('utf-8')
}

export function asymmetricKeyDecryption(data: Buffer): string {
  try {
    return decipher(data, false)
  } catch(e) {
    logger.error(`Asymmetric Key Decryption failed with error: ${e}.\nStack trace: ${e.trace}` )
    try {
      return decipher(data, true)
    } catch(e1) {
      logger.error(`Asymmetric Key Decryption failed with error: ${e1}.\nStack trace: ${e1.trace}` )
      return ""
    }
  }
}

const protectedHeader = { alg: "RSA256", enc: "aes-256-cbc" }

function formatKey(key: string) {
  return key.replace("\\n", "\n")
}

export async function getJWE(payload: JWTPayload, expiresIn?: number): Promise<string> {
  const jwt = new UnsecuredJWT(payload)
    .setIssuer("lida-api")
    .setExpirationTime(expiresIn || 0)
    .encode()
  const jweEnc = new CompactEncrypt(Buffer.from(jwt))
  jweEnc.setProtectedHeader(protectedHeader)
  return jweEnc.encrypt(await importSPKI(formatKey(JWT_PUBLIC_KEY), "RS384"))
}

export async function parseJWE(jwe: string): Promise<JWTPayload & { [name: string]: any }> {
  let unsecuredJwt = ""
  const jwt = await compactDecrypt(jwe, await importPKCS8(formatKey(JWT_PRIVATE_KEY), "RS384"))
  const { alg, enc } = jwt.protectedHeader

  if(protectedHeader.alg != alg || protectedHeader.enc != enc)
    return Promise.reject({
      message: "Wrong token format",
      type: "Security"
    })
  unsecuredJwt = Buffer.from(jwt.plaintext).toString('utf-8')

  return decodeJwt(unsecuredJwt)
}