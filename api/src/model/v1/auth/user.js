"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const baseKey_1 = require("../../../controller/security/token/baseKey");
class User {
    constructor(userData, accessToken) {
        this.displayName = userData.displayName;
        this.email = userData.email;
        this.emailVerified = userData.emailVerified;
        this.phoneNumber = userData.phoneNumber;
        this.photoURL = userData.photoURL;
        this.isLoggedOut = false;
        this.accessToken = accessToken.toString(constants_1.defaultKeySchema == baseKey_1.KeySchema.AES ? 'hex' : 'utf-8');
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