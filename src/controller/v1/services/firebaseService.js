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
exports.persistConnection = void 0;
const secret_json_1 = require("../../../../secret/secret.json");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebaseStorageService_1 = __importDefault(require("../../database/firebase/services/firebaseStorageService"));
const firebaseRealtimeService_1 = __importDefault(require("../../database/firebase/services/firebaseRealtimeService"));
const firebaseFirestoreService_1 = __importDefault(require("../../database/firebase/services/firebaseFirestoreService"));
const firebaseAuthService_1 = __importDefault(require("../../security/service/firebaseAuthService"));
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const serviceAccount = require("../../../../secret/serviceAccountKey.json");
class FirebaseService {
    constructor(type, path) {
        this._app = firebase_admin_1.default.initializeApp(Object.assign({ credential: firebase_admin_1.default.credential.cert(serviceAccount) }, secret_json_1.firebaseConfig), Array(10).fill(0).map(_ => String.fromCharCode((0, crypto_1.randomInt)(65, 90))).join(''));
        if (this.verifyType(type, 1))
            this._storageService = new firebaseStorageService_1.default(this._app);
        if (this.verifyType(type, 2))
            this._realtimeService = new firebaseRealtimeService_1.default(this._app, path === null || path === void 0 ? void 0 : path.realtimeUrl);
        if (this.verifyType(type, 4))
            this._firestoreService = new firebaseFirestoreService_1.default(this._app);
        if (this.verifyType(type, 8))
            this._auth = new firebaseAuthService_1.default(this._app);
    }
    get storageService() { return this._storageService; }
    get realtimeService() { return this._realtimeService; }
    get firestoreService() { return this._firestoreService; }
    get authService() { return this._auth; }
    verifyType(type, target) {
        return (type & target) == target;
    }
    setRules(rules) {
        return __awaiter(this, void 0, void 0, function* () {
            const securityRules = firebase_admin_1.default.securityRules(this._app);
            if (rules.firestore && (0, fs_1.existsSync)(rules.firestore)) {
                Promise.all([
                    securityRules.releaseFirestoreRulesetFromSource((0, fs_1.readFileSync)(rules.firestore, 'utf-8'))
                ]);
            }
            if (rules.storage && (0, fs_1.existsSync)(rules.storage)) {
                Promise.all([
                    securityRules.releaseStorageRulesetFromSource((0, fs_1.readFileSync)(rules.storage, 'utf-8'))
                ]);
            }
            if (rules.realtimeDatabase && (0, fs_1.existsSync)(rules.realtimeDatabase)) {
                firebase_admin_1.default.database(this._app).setRules((0, fs_1.readFileSync)(rules.realtimeDatabase, 'utf-8'));
            }
            return this;
        });
    }
}
exports.default = FirebaseService;
exports.persistConnection = new FirebaseService(2147483647, null);
//# sourceMappingURL=firebaseService.js.map