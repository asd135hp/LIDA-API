"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const constants_1 = require("../../constants");
const encryption_1 = require("../encryption");
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
test("should sign and verify jwt", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(constants_1.JWT_SECRET);
    for (let i = 0; i < 10; i++) {
        const a = (0, encryption_1.jwtSign)({ data: (0, crypto_1.randomBytes)(32).toString('hex') }, (200 * i).toString() + "ms");
        try {
            (0, encryption_1.jwtVerify)(a);
            console.log("Success");
        }
        catch (e) {
            console.log("Failed", e);
        }
    }
}), 100000);
//# sourceMappingURL=encryption.test.js.map