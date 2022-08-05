import { UpdateRequest } from "firebase-admin/auth"

export default class User {
  private _name: string
  private _email: string
  private _phoneNumber: string
  private _photoURL: string
  private _isLoggedOut: boolean
  private _emailVerified: boolean
  private _accessToken: string

  constructor(userData: any, accessToken: string) {
    this._name = userData.displayName
    this._email = userData.email
    this._emailVerified = userData.emailVerified
    this._phoneNumber = userData.phoneNumber
    this._photoURL = userData.photoURL
    this._isLoggedOut = false
    this._accessToken = accessToken
  }

  get displayName(){ return this._name }
  get email(){ return this._email }
  get emailVerified(){ return this._emailVerified }
  get phoneNumber(){ return this._phoneNumber }
  get photoURL(){ return this._photoURL }
  get isLoggedOut(){ return this._isLoggedOut }
  get accessToken() { return this._accessToken }

  logOut() { this._isLoggedOut = true }

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