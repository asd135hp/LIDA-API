import { createCipheriv, createDecipheriv } from "crypto"
import { RAW_CIPHER_IV, RAW_CIPHER_KEY } from "../constants"

let authTag: Buffer = null

export function asymmetricKeyEncryption(data: string): Buffer {
  const cipher = createCipheriv("aes-256-gcm", RAW_CIPHER_KEY, RAW_CIPHER_IV)
  const buffer = Buffer.concat([cipher.update(data), cipher.final()])
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
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf-8')
}

