"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asymmetricKeyDecryption = exports.asymmetricKeyEncryption = void 0;
const crypto_1 = require("crypto");
const constants_1 = require("../constants");
function asymmetricKeyEncryption(data) {
    const cipher = (0, crypto_1.createCipheriv)(constants_1.CIPHER_ALGORITHM, constants_1.RAW_CIPHER_KEY, constants_1.RAW_CIPHER_IV, {
        authTagLength: 16
    });
    return cipher.update(data, 'utf-8', 'hex') + cipher.final('hex');
}
exports.asymmetricKeyEncryption = asymmetricKeyEncryption;
function asymmetricKeyDecryption(data) {
    const decipher = (0, crypto_1.createDecipheriv)(constants_1.CIPHER_ALGORITHM, constants_1.RAW_CIPHER_KEY, constants_1.RAW_CIPHER_IV, {
        authTagLength: 16
    });
    return decipher.update(data, 'hex', 'utf-8') + decipher.final('utf-8');
}
exports.asymmetricKeyDecryption = asymmetricKeyDecryption;
//# sourceMappingURL=crypto.js.map