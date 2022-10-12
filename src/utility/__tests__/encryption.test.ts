import { createDecipheriv, createCipheriv } from "crypto"
import { RAW_CIPHER_KEY, RAW_CIPHER_IV } from "../../constants"

const data = "abcxyz"
let authTag: Buffer = null

const encryption = jest.fn((data: string)=>{
  const cipher = createCipheriv("aes-256-gcm", RAW_CIPHER_KEY, RAW_CIPHER_IV)
  const newBuffer = Buffer.concat([cipher.update(data), cipher.final()])
  authTag = cipher.getAuthTag()
  return newBuffer
})

const decryption = jest.fn((data: Buffer)=>{
  const decipher = createDecipheriv("aes-256-gcm", RAW_CIPHER_KEY, RAW_CIPHER_IV)
  decipher.setAuthTag(authTag)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf-8')
})

it("should encrypt and decipher data", ()=>{
  for(let i = 0; i < 10; i++){
    let encText = encryption(data)
    //console.log(encText, authTag.toString('hex'))
    let text = decryption(encText)
    //console.log(text)
    expect(text).toBe(data)
  }
})