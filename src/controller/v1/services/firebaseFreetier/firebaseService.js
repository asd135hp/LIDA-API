"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistentFirebaseConnection = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebaseStorageService_1 = __importDefault(require("../../../database/firebase/services/firebaseStorageService"));
const firebaseRealtimeService_1 = __importDefault(require("../../../database/firebase/services/firebaseRealtimeService"));
const firebaseFirestoreService_1 = __importDefault(require("../../../database/firebase/services/firebaseFirestoreService"));
const firebaseAuthService_1 = __importDefault(require("../../../database/firebase/services/firebaseAuthService"));
const crypto_1 = require("crypto");
const constants_1 = require("../../../../constants");
class FirebaseService {
    constructor(type, path) {
        this._app = firebase_admin_1.default.initializeApp(Object.assign({ credential: firebase_admin_1.default.credential.cert(constants_1.SERVICE_ACCOUNT_CREDENTIALS) }, constants_1.FIREBASE_CONFIG), Array(10).fill(0).map(_ => String.fromCharCode((0, crypto_1.randomInt)(65, 90))).join(''));
        if (process.env.NODE_ENV !== 'production') {
        }
        if (this.verifyType(type, 1))
            this._storageService = new firebaseStorageService_1.default(this._app, path === null || path === void 0 ? void 0 : path.storageFolder);
        if (this.verifyType(type, 2))
            this._realtimeService = new firebaseRealtimeService_1.default(this._app, path === null || path === void 0 ? void 0 : path.realtimeUrl);
        if (this.verifyType(type, 4))
            this._firestoreService = new firebaseFirestoreService_1.default(this._app, path === null || path === void 0 ? void 0 : path.firestoreDocPath);
        if (this.verifyType(type, 8))
            this._auth = new firebaseAuthService_1.default(this._app, this._storageService || new firebaseStorageService_1.default(this._app));
    }
    get storageService() { return this._storageService; }
    get realtimeService() { return this._realtimeService; }
    get firestoreService() { return this._firestoreService; }
    get authService() { return this._auth; }
    verifyType(type, target) {
        return (type & target) == target;
    }
}
exports.default = FirebaseService;
exports.persistentFirebaseConnection = new FirebaseService(2147483647, constants_1.firebasePathConfig);
//# sourceMappingURL=firebaseService.js.map