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
exports.expressAuthentication = void 0;
const encryption_1 = require("../../utility/encryption");
const firebaseService_1 = require("../v1/services/firebaseFreetier/firebaseService");
function expressAuthentication(request, securityName, scopes) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (securityName === "api_key") {
            let token = (_a = request.query) === null || _a === void 0 ? void 0 : _a.accessToken;
            if (!token)
                return Promise.reject({ message: "No authentication token is provided" });
            if (Array.isArray(token))
                return Promise.reject({ message: "Wrong token format - only one token is needed" });
            const unpacked = (0, encryption_1.asymmetricKeyDecryption)(Buffer.from(token.toString(), 'hex')).split('|');
            if (unpacked.length != 2)
                return Promise.reject({ message: "Wrong token format" });
            const [userId, apiKey] = unpacked;
            const service = firebaseService_1.persistentFirebaseConnection.authService;
            return yield service.verifyApiKey(userId, apiKey);
        }
    });
}
exports.expressAuthentication = expressAuthentication;
//# sourceMappingURL=authentication.js.map