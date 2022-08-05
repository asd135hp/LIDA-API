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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const constants_1 = require("../../../../constants");
const user_1 = __importDefault(require("../../../../model/v1/auth/user"));
const luxon_1 = require("luxon");
const crypto_1 = require("crypto");
const encryption_1 = require("../../../../utility/encryption");
class APIKey {
    constructor(storage, priviledge = "admin") {
        this.storage = storage;
        this.priviledge = priviledge;
    }
    getAuthFilePath(email) { return `auth/user/${email}/api_key.json`; }
    getKey(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.getAuthFilePath(uid);
            if (!(yield this.storage.isFileExists(path)))
                return "";
            const data = (yield this.storage.readFileFromStorage(path)).toString();
            constants_1.logger.info("APIKey - getKey: " + data);
            if (!data)
                return "";
            const json = JSON.parse(data);
            if (!json || !json[this.priviledge])
                return "";
            const keyInfo = json[this.priviledge];
            if (keyInfo.expiraryDate <= luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger())
                return "";
            return keyInfo.apiKey;
        });
    }
    validateKey(uid, apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedAPIKey = yield this.getKey(uid);
            constants_1.logger.warn("FirebaseAuthService - validateKey: Stored API key" + storedAPIKey);
            return storedAPIKey === apiKey;
        });
    }
    renewKey(uid, expiraryDateFromNow = 3600 * 24 * 30) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = (0, crypto_1.randomBytes)(64).toString("base64");
            const data = ((yield this.storage.isFileExists(this.getAuthFilePath(uid))) &&
                (yield this.storage.readFileFromStorage(this.getAuthFilePath(uid))).toString()) || "{}";
            const json = JSON.parse(data);
            json[this.priviledge] = {
                expirary: luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger() + expiraryDateFromNow,
                apiKey
            };
            constants_1.logger.debug("FirebaseAuthService - reauth: " + JSON.stringify(json));
            return yield this.storage.uploadBytesToStorage(this.getAuthFilePath(uid), JSON.stringify(json))
                .then(() => apiKey, () => "");
        });
    }
}
class FirebaseAuthService {
    constructor(firebaseApp, storageFacade) {
        this.clientAuth = (0, auth_1.getAuth)((0, app_1.initializeApp)(constants_1.FIREBASE_CONFIG, Array(10).fill(0).map(_ => String.fromCharCode((0, crypto_1.randomInt)(65, 90))).join('')));
        this.adminAuth = firebase_admin_1.default.auth(firebaseApp);
        this.storage = storageFacade;
    }
    loginWithEmail(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, auth_1.signInWithEmailAndPassword)(this.clientAuth, email, password)
                .then((credentials) => __awaiter(this, void 0, void 0, function* () {
                const apiKeyObj = new APIKey(this.storage, "admin");
                const apiKey = (yield apiKeyObj.getKey(credentials.user.uid)) ||
                    (yield apiKeyObj.renewKey(credentials.user.uid));
                constants_1.logger.info("FirebaseAuthService - loginWithEmail: New user logged in!");
                let accessToken = "";
                if (apiKey) {
                    accessToken = (0, encryption_1.asymmetricKeyEncryption)(`${credentials.user.uid}|${apiKey}`);
                    return new user_1.default(credentials.user, accessToken);
                }
                return Promise.reject({
                    message: "Authentication failed",
                    reason: "Could not regenerate new API key"
                });
            }));
        });
    }
    loginWithProvider() {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
    registerWithEmail(email, password, redirectUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adminAuth.createUser({
                email,
                password,
                displayName: (0, crypto_1.randomBytes)(15).toString("base64")
            }).then((record) => __awaiter(this, void 0, void 0, function* () {
                const apiKey = new APIKey(this.storage, "admin");
                yield apiKey.renewKey(record.uid);
                constants_1.logger.info("FirebaseAuthService - registerWithEmail: New user is registered");
            }))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    reauthenticationWithEmail(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, auth_1.signInWithEmailAndPassword)(this.clientAuth, email, password)
                .then((credentials) => __awaiter(this, void 0, void 0, function* () {
                const apiKey = yield new APIKey(this.storage, "admin").renewKey(credentials.user.uid);
                constants_1.logger.info("FirebaseAuthService - reauthenticationWithEmail: New user logged in!");
                let accessToken = "";
                if (apiKey) {
                    accessToken = (0, encryption_1.asymmetricKeyEncryption)(`${credentials.user.uid}|${apiKey}`);
                    return new user_1.default(credentials.user, accessToken);
                }
                return Promise.reject({
                    message: "Reauthentication failed",
                    reason: "Could not regenerate new API key"
                });
            }));
        });
    }
    verifyApiKey(uid, apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.debug("FirebaseAuthService: Verifying API key");
            return new APIKey(this.storage, "admin").validateKey(uid, apiKey);
        });
    }
    updatePassword(user, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    forgotPassword() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    deleteUser(uid, apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = new APIKey(this.storage, "admin");
            if (!(yield key.validateKey(uid, apiKey)))
                return;
            yield this.adminAuth.deleteUser(uid)
                .then(() => constants_1.logger.info(`User with uid ${uid} is deleted`))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    logout(user) { user && !user.isLoggedOut && user.logOut(); }
}
exports.default = FirebaseAuthService;
//# sourceMappingURL=firebaseAuthService.js.map