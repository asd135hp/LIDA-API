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
exports.parseJWE = exports.getJWE = exports.asymmetricKeyDecryption = exports.asymmetricKeyEncryption = void 0;
const jose_1 = require("jose");
const crypto_1 = require("crypto");
const constants_1 = require("../constants");
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
function decipher(data, autoPadding) {
    const decipher = (0, crypto_1.createDecipheriv)("aes-256-gcm", constants_1.RAW_CIPHER_KEY, constants_1.RAW_CIPHER_IV);
    decipher.setAutoPadding(autoPadding);
    decipher.setAuthTag(authTag);
    const updateBuffer = decipher.update(data);
    const finalBuffer = decipher.final();
    return Buffer.concat([updateBuffer, finalBuffer]).toString('utf-8');
}
function asymmetricKeyDecryption(data) {
    if (!authTag) {
        try {
            const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", constants_1.RAW_CIPHER_KEY, constants_1.RAW_CIPHER_IV);
            cipher.final();
            authTag = cipher.getAuthTag();
        }
        catch (e) {
            constants_1.logger.error(`Asymmetric Key Decryption failed when setting auth tag with error: ${e}.\nStack trace: ${e.trace}`);
        }
    }
    try {
        return decipher(data, false);
    }
    catch (e) {
        constants_1.logger.error(`Asymmetric Key Decryption failed with error: ${e}.\nStack trace: ${e.trace}`);
        try {
            return decipher(data, true);
        }
        catch (e1) {
            constants_1.logger.error(`Asymmetric Key Decryption failed with error: ${e1}.\nStack trace: ${e1.trace}`);
            return "";
        }
    }
}
exports.asymmetricKeyDecryption = asymmetricKeyDecryption;
const protectedHeader = { alg: "RSA256", enc: "aes-256-cbc" };
function formatKey(key) {
    return key.replace("\\n", "\n");
}
function getJWE(payload, expiresIn) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwt = new jose_1.UnsecuredJWT(payload)
            .setIssuer("lida-api")
            .setExpirationTime(expiresIn || 0)
            .encode();
        const jweEnc = new jose_1.CompactEncrypt(Buffer.from(jwt));
        jweEnc.setProtectedHeader(protectedHeader);
        return jweEnc.encrypt(yield (0, jose_1.importSPKI)(formatKey(constants_1.JWT_PUBLIC_KEY), "RS384"));
    });
}
exports.getJWE = getJWE;
function parseJWE(jwe) {
    return __awaiter(this, void 0, void 0, function* () {
        let unsecuredJwt = "";
        const jwt = yield (0, jose_1.compactDecrypt)(jwe, yield (0, jose_1.importPKCS8)(formatKey(constants_1.JWT_PRIVATE_KEY), "RS384"));
        const { alg, enc } = jwt.protectedHeader;
        if (protectedHeader.alg != alg || protectedHeader.enc != enc)
            return Promise.reject({
                message: "Wrong token format",
                type: "Security"
            });
        unsecuredJwt = Buffer.from(jwt.plaintext).toString('utf-8');
        return (0, jose_1.decodeJwt)(unsecuredJwt);
    });
}
exports.parseJWE = parseJWE;
//# sourceMappingURL=encryption.js.map