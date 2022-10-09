import { UpdateRequest } from "firebase-admin/auth"
import { defaultKeySchema } from "../../../constants"
import { KeySchema } from "../../../controller/security/token/baseKey"

export default class User {
  displayName: string
  email: string
  phoneNumber: string
  photoURL: string
  isLoggedOut: boolean
  emailVerified: boolean
  accessToken: string

  constructor(userData: any, accessToken: Buffer) {
    this.displayName = userData.displayName
    this.email = userData.email
    this.emailVerified = userData.emailVerified
    this.phoneNumber = userData.phoneNumber
    this.photoURL = userData.photoURL
    this.isLoggedOut = false
    this.accessToken = accessToken.toString(defaultKeySchema == KeySchema.AES ? 'hex' : 'utf-8')
  }

  logOut() { this.isLoggedOut = true }

  toUpdateRequest(): UpdateRequest {
    return {
      email: this.email,
      emailVerified: this.emailVerified,
      displayName: this.displayName,
      phoneNumber: this.phoneNumber,
      photoURL: this.photoURL
    }
  }
}