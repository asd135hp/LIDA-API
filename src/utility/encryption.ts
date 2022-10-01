import { createCipheriv, createDecipheriv } from "crypto"
import { JWT_SECRET, RAW_CIPHER_IV, RAW_CIPHER_KEY } from "../constants"
import { sign, JwtPayload, verify } from 'jsonwebtoken'

let authTag: Buffer = null

export function asymmetricKeyEncryption(data: string): Buffer {
  const cipher = createCipheriv("aes-256-gcm", RAW_CIPHER_KEY, RAW_CIPHER_IV)
  const updateBuffer = cipher.update(data)
  const finalBuffer = cipher.final()
  const buffer = Buffer.concat([updateBuffer, finalBuffer])
  authTag = cipher.getAuthTag()
  return buffer
}

export function asymmetricKeyDecryption(data: Buffer): string {
  const decipher = createDecipheriv("aes-256-gcm", RAW_CIPHER_KEY, RAW_CIPHER_IV)
  // impromptu auth tag generation. could throw an error
  if(!authTag) {
    const cipher = createCipheriv("aes-256-gcm", RAW_CIPHER_KEY, RAW_CIPHER_IV)
    cipher.final()
    authTag = cipher.getAuthTag()
  }
  decipher.setAuthTag(authTag)

  const updateBuffer = decipher.update(data)
  const finalBuffer = decipher.final()
  return Buffer.concat([updateBuffer, finalBuffer]).toString('utf-8')
}

export function jwtSign(payload: JwtPayload, expiresIn?: number | string): string {
  return sign(payload, JWT_SECRET, {
    algorithm: "HS384",
    issuer: "lida-api",
    expiresIn: expiresIn || "1d"
  })
}

export function jwtVerify(token: string): JwtPayload {
  const payload = verify(token, JWT_SECRET, {
    algorithms: ["HS384", "ES384", "PS384", "RS512", "ES512", "HS512", "PS512"],
    issuer: "lida-api",
    ignoreExpiration: false
  })

  return typeof(payload) === 'string' ? {} : payload
}