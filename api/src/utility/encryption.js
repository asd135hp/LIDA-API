"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtVerify = exports.jwtSign = exports.asymmetricKeyDecryption = exports.asymmetricKeyEncryption = void 0;
const crypto_1 = require("crypto");
const constants_1 = require("../constants");
const jsonwebtoken_1 = require("jsonwebtoken");
let authTag = null;
function asymmetricKeyEncryption(data) {
    const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", constants_1.RAW_CIPHER_KEY, constants_1.RAW_CIPHER_IV);
    const updateBuffer = cipher.update(data);
    const finalBuffer = cipher.final();
    const buffer = Buffer.concat([updateBuffer, finalBuffer]);
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
    const updateBuffer = decipher.update(data);
    const finalBuffer = decipher.final();
    return Buffer.concat([updateBuffer, finalBuffer]).toString('utf-8');
}
exports.asymmetricKeyDecryption = asymmetricKeyDecryption;
function jwtSign(payload, expiresIn) {
    return (0, jsonwebtoken_1.sign)(payload, constants_1.JWT_SECRET, {
        algorithm: "HS384",
        issuer: "lida-api",
        expiresIn: expiresIn || "1d"
    });
}
exports.jwtSign = jwtSign;
function jwtVerify(token) {
    const payload = (0, jsonwebtoken_1.verify)(token, constants_1.JWT_SECRET, {
        algorithms: ["HS384", "ES384", "PS384", "RS512", "ES512", "HS512", "PS512"],
        issuer: "lida-api",
        ignoreExpiration: false
    });
    return typeof (payload) === 'string' ? {} : payload;
}
exports.jwtVerify = jwtVerify;
//# sourceMappingURL=encryption.js.map