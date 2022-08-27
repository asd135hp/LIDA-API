"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(userData, accessToken) {
        this.displayName = userData.displayName;
        this.email = userData.email;
        this.emailVerified = userData.emailVerified;
        this.phoneNumber = userData.phoneNumber;
        this.photoURL = userData.photoURL;
        this.isLoggedOut = false;
        this.accessToken = accessToken.toString('hex');
    }
    logOut() { this.isLoggedOut = true; }
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