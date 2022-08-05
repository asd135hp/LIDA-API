import { CipherCCMOptions, createCipheriv, createDecipheriv } from "crypto"
import { CIPHER_ALGORITHM, RAW_CIPHER_IV, RAW_CIPHER_KEY } from "../constants"

export function asymmetricKeyEncryption(data: string): string {
  const cipher = createCipheriv(CIPHER_ALGORITHM, RAW_CIPHER_KEY, RAW_CIPHER_IV, {
    authTagLength: 16
  } as CipherCCMOptions)
  return cipher.update(data, 'utf-8', 'hex') + cipher.final('hex')
}

export function asymmetricKeyDecryption(data: string): string {
  const decipher = createDecipheriv(CIPHER_ALGORITHM, RAW_CIPHER_KEY, RAW_CIPHER_IV, {
    authTagLength: 16
  } as CipherCCMOptions)
  return decipher.update(data, 'hex', 'utf-8') + decipher.final('utf-8')
}

