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
exports.KeySchema = exports.BaseKey = void 0;
const crypto_1 = require("crypto");
const luxon_1 = require("luxon");
const constants_1 = require("../../../constants");
class BaseKey {
    constructor(storage, privilege = "admin") {
        this.storage = storage;
        this.privilege = privilege;
    }
    checkStorage() {
        if (!this.storage)
            return Promise.reject({
                message: "Cannot get storage reference",
                type: "Basic Key"
            });
    }
    getAuthFilePath(email) { return `auth/user/${email}/api_token.json`; }
    getAPIKey(uid, renewalRetries) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkStorage();
            const path = this.getAuthFilePath(uid);
            if (!(yield this.storage.isFileExists(path))) {
                if (renewalRetries === 3)
                    return "";
                yield this.renewKey(uid);
                return this.getAPIKey(uid, renewalRetries + 1);
            }
            const data = (yield this.storage.readFileFromStorage(path)).toString();
            constants_1.logger.info("APIKey - getKey: " + data);
            if (!data)
                return "";
            const json = JSON.parse(data);
            if (!json || !json[this.privilege])
                return "";
            const keyInfo = json[this.privilege];
            if (keyInfo.expiraryDate <= luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger())
                return "";
            return keyInfo.apiKey;
        });
    }
    validateKey(uid, apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkStorage();
            const storedAPIKey = yield this.getAPIKey(uid);
            constants_1.logger.warn("FirebaseAuthService - validateKey: Stored API key" + storedAPIKey);
            return storedAPIKey === apiKey;
        });
    }
    renewKey(uid, expiraryDateFromNow) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkStorage();
            const apiKey = (0, crypto_1.randomBytes)(64).toString("base64");
            const data = ((yield this.storage.isFileExists(this.getAuthFilePath(uid))) &&
                (yield this.storage.readFileFromStorage(this.getAuthFilePath(uid))).toString()) || "{}";
            const json = JSON.parse(data);
            json[this.privilege] = {
                expirary: luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger() + expiraryDateFromNow,
                apiKey
            };
            constants_1.logger.debug("FirebaseAuthService - reauth: " + JSON.stringify(json));
            return yield this.storage.uploadBytesToStorage(this.getAuthFilePath(uid), JSON.stringify(json))
                .then(() => apiKey, () => "");
        });
    }
}
exports.BaseKey = BaseKey;
var KeySchema;
(function (KeySchema) {
    KeySchema["JWT"] = "jwt";
    KeySchema["AES"] = "aes";
})(KeySchema = exports.KeySchema || (exports.KeySchema = {}));
//# sourceMappingURL=baseKey.js.map