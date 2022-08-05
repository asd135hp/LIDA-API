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
const apiSetup_1 = __importDefault(require("../apiSetup"));
const constants_1 = require("../constants");
const queryFacade_1 = __importDefault(require("../controller/queryFacade"));
const promises_1 = require("timers/promises");
const firebaseService_1 = require("../controller/v1/services/firebaseFreetier/firebaseService");
const encryption_1 = require("./encryption");
class TestSetup {
    constructor() {
        this.closeHandler = null;
        this.prevEnv = process.env.NODE_ENV;
        this.user = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = constants_1.TEST_ACCOUNT;
            this.prevEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'test';
            this.closeHandler = (0, apiSetup_1.default)(null);
            yield queryFacade_1.default.security.register(email, password).then(() => __awaiter(this, void 0, void 0, function* () { return yield (0, promises_1.setTimeout)(2000); }), () => { });
            this.user = yield queryFacade_1.default.security.login(email, password).catch(() => null);
        });
    }
    getAccessToken() {
        var _a, _b;
        let count = 0;
        while (count++ < 10) {
            if (!this.user)
                (0, promises_1.setTimeout)(250).then(() => { });
        }
        return (_b = (_a = this.user) === null || _a === void 0 ? void 0 : _a.accessToken) !== null && _b !== void 0 ? _b : "";
    }
    tearDown() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            process.env.NODE_ENV = this.prevEnv;
            const [uid, apiKey] = (0, encryption_1.asymmetricKeyDecryption)(this.getAccessToken()).split("|");
            yield firebaseService_1.persistentFirebaseConnection.authService.deleteUser(uid, apiKey);
            (_a = this.closeHandler) === null || _a === void 0 ? void 0 : _a.call(null);
        });
    }
}
exports.default = TestSetup;
TestSetup.TIME_OUT = 5000;
//# sourceMappingURL=testSetup.js.map