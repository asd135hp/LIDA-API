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
exports.JWTKey = void 0;
const encryption_1 = require("../../../utility/encryption");
const baseKey_1 = require("./baseKey");
class JWTKey extends baseKey_1.BaseKey {
    getAPIKey(uid, renewalRetries = 3) {
        const _super = Object.create(null, {
            getAPIKey: { get: () => super.getAPIKey }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getAPIKey.call(this, uid, renewalRetries);
        });
    }
    renewKey(uid, expiraryDateFromNow = 3600 * 24 * 30) {
        const _super = Object.create(null, {
            renewKey: { get: () => super.renewKey }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.renewKey.call(this, uid, expiraryDateFromNow);
        });
    }
    generateToken(uid, apiKey) {
        return Buffer.from((0, encryption_1.signJWT)({ uid, apiKey }));
    }
    parseToken(token) {
        return (0, encryption_1.parseJWT)(token);
    }
}
exports.JWTKey = JWTKey;
//# sourceMappingURL=jwtToken.js.map