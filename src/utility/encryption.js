"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asymmetricKeyDecryption = exports.asymmetricKeyEncryption = void 0;
const crypto_1 = require("crypto");
const constants_1 = require("../constants");
let authTag = null;
function asymmetricKeyEncryption(data) {
    const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", constants_1.RAW_CIPHER_KEY, constants_1.RAW_CIPHER_IV);
    const buffer = Buffer.concat([cipher.update(data), cipher.final()]);
    authTag = cipher.getAuthTag();
    return buffer;
}
exports.asymmetricKeyEncryption = asymmetricKeyEncryption;
function asymmetricKeyDecryption(data) {
    const decipher = (0, crypto_1.createDecipheriv)("aes-256-gcm", constants_1.RAW_CIPHER_KEY, constants_1.RAW_CIPHER_IV);
    if (!authTag) {
        const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", constants_1.RAW_CIPHER_KEY, constants_1.RAW_CIPHER_IV);
        cipher.final();
        authTag = cipher.getAuthTag();
    }
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf-8');
}
exports.asymmetricKeyDecryption = asymmetricKeyDecryption;
//# sourceMappingURL=encryption.js.map