"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTKey = void 0;
const encryption_1 = require("../../../utility/encryption");
const baseKey_1 = require("./baseKey");
class JWTKey extends baseKey_1.BaseKey {
    generateToken(uid, apiKey) {
        const token = (0, encryption_1.jwtSign)({ uid, apiKey });
        return Buffer.from(token);
    }
    parseToken(token) {
        const payload = (0, encryption_1.jwtVerify)(token);
        return payload;
    }
}
exports.JWTKey = JWTKey;
//# sourceMappingURL=jwtToken.js.map