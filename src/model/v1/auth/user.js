"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(userData, accessToken) {
        this._name = userData.displayName;
        this._email = userData.email;
        this._emailVerified = userData.emailVerified;
        this._phoneNumber = userData.phoneNumber;
        this._photoURL = userData.photoURL;
        this._isLoggedOut = false;
        this._accessToken = accessToken;
    }
    get displayName() { return this._name; }
    get email() { return this._email; }
    get emailVerified() { return this._emailVerified; }
    get phoneNumber() { return this._phoneNumber; }
    get photoURL() { return this._photoURL; }
    get isLoggedOut() { return this._isLoggedOut; }
    get accessToken() { return this._accessToken; }
    logOut() { this._isLoggedOut = true; }
    toUpdateRequest() {
        return {
            email: this.email,
            emailVerified: this.emailVerified,
            displayName: this.displayName,
            phoneNumber: this.phoneNumber,
            photoURL: this.photoURL
        };
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map