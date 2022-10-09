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
const crypto_1 = require("crypto");
class FirebaseAuthService {
    constructor(firebaseApp, apiKey) {
        this.clientAuth = (0, auth_1.getAuth)((0, app_1.initializeApp)(constants_1.FIREBASE_CONFIG, Array(10).fill(0).map(_ => String.fromCharCode((0, crypto_1.randomInt)(65, 90))).join('')));
        this.adminAuth = firebase_admin_1.default.auth(firebaseApp);
        this.apiKey = apiKey;
    }
    loginWithEmail(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, auth_1.signInWithEmailAndPassword)(this.clientAuth, email, password)
                .then((credentials) => __awaiter(this, void 0, void 0, function* () {
                let apiKey = "";
                try {
                    apiKey = yield this.apiKey.getAPIKey(credentials.user.uid);
                }
                catch (e) {
                    apiKey = yield this.apiKey.renewKey(credentials.user.uid);
                }
                constants_1.logger.info("FirebaseAuthService - loginWithEmail: New user logged in!");
                let accessToken = null;
                if (apiKey) {
                    accessToken = this.apiKey.generateToken(credentials.user.uid, apiKey);
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
                yield this.apiKey.renewKey(record.uid);
                constants_1.logger.info("FirebaseAuthService - registerWithEmail: New user is registered");
            }))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    reauthenticationWithEmail(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, auth_1.signInWithEmailAndPassword)(this.clientAuth, email, password)
                .then((credentials) => __awaiter(this, void 0, void 0, function* () {
                const apiKey = yield this.apiKey.renewKey(credentials.user.uid);
                constants_1.logger.info("FirebaseAuthService - reauthenticationWithEmail: New user logged in!");
                let accessToken = null;
                if (apiKey) {
                    accessToken = this.apiKey.generateToken(credentials.user.uid, apiKey);
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
            return this.apiKey.validateKey(uid, apiKey);
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
            if (!(yield this.apiKey.validateKey(uid, apiKey)))
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