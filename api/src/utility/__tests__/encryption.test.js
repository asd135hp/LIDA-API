"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const constants_1 = require("../../constants");
const data = "abcxyz";
let authTag = null;
const encryption = jest.fn((data) => {
    const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", constants_1.RAW_CIPHER_KEY, constants_1.RAW_CIPHER_IV);
    const newBuffer = Buffer.concat([cipher.update(data), cipher.final()]);
    authTag = cipher.getAuthTag();
    return newBuffer;
});
const decryption = jest.fn((data) => {
    const decipher = (0, crypto_1.createDecipheriv)("aes-256-gcm", constants_1.RAW_CIPHER_KEY, constants_1.RAW_CIPHER_IV);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf-8');
});
it("should encrypt and decipher data", () => {
    for (let i = 0; i < 10; i++) {
        let encText = encryption(data);
        let text = decryption(encText);
        expect(text).toBe(data);
    }
});
//# sourceMappingURL=encryption.test.js.map