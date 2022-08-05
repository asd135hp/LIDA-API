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
exports.getQueryResultAsArray = exports.getQueryResult = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const constants_1 = require("../../../../constants");
const updateObject_1 = __importDefault(require("../../../../utility/updateObject"));
const option_1 = require("../../../../model/patterns/option");
function getQueryResult(query, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = {};
        yield query.once('child_added', child => {
            const data = child.val();
            if (!filter || filter(data))
                result[child.key] = data;
        });
        constants_1.logger.info(`Result of query that is sorted by child at ${query.ref.key}: ${result}`);
        return result;
    });
}
exports.getQueryResult = getQueryResult;
function getQueryResultAsArray(query, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultArr = [];
        yield query.once('value', snapshot => {
            if (!snapshot.exists()) {
                constants_1.logger.warn("Snapshot does not exist with a value of " + snapshot.val());
                return;
            }
            snapshot.forEach(child => {
                const data = child.val();
                if (!filter || filter(data))
                    resultArr.push(data);
            });
        });
        constants_1.logger.info(`Result of query that is sorted by child at ${query.ref.key}: ${resultArr}`);
        return resultArr.length == 0 ? option_1.None : (0, option_1.Some)(resultArr);
    });
}
exports.getQueryResultAsArray = getQueryResultAsArray;
const logError = (err, onComplete) => (err && constants_1.logger.error(err), onComplete);
class FirebaseRealtimeService {
    constructor(firebaseApp, basePath) {
        this.database = firebase_admin_1.default.database(firebaseApp);
        this.rootRef = this.database.ref(basePath);
    }
    changeRootReference(basePath) {
        this.rootRef = this.database.ref(basePath);
        return this;
    }
    getContent(path, queryCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = path ? this.rootRef.child(path) : this.rootRef;
            return (queryCallback ? queryCallback(ref) : ref.get())
                .then(snapshot => (constants_1.logger.info(`Realtime database service: Got realtime data from ${path}`), snapshot))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    pushContent(content, path, onComplete) {
        return (path ? this.rootRef.child(path) : this.rootRef)
            .push(content, err => {
            if (!err)
                constants_1.logger.info(`Realtime database service: Pushed content at ${path} for realtime database`);
            logError(err, onComplete);
        });
    }
    setContent(content, path, onComplete) {
        return __awaiter(this, void 0, void 0, function* () {
            return (path ? this.rootRef.child(path) : this.rootRef)
                .transaction(_ => content, err => {
                if (!err)
                    constants_1.logger.info(`Realtime database service: Set content at ${path} for realtime database`);
                logError(err, onComplete);
            });
        });
    }
    updateContent(content, path, onComplete) {
        return __awaiter(this, void 0, void 0, function* () {
            return (path ? this.rootRef.child(path) : this.rootRef)
                .transaction(oldContent => (0, updateObject_1.default)(oldContent, content), err => {
                if (!err)
                    constants_1.logger.info(`Realtime database service: Updated content at ${path} for realtime database`);
                logError(err, onComplete);
            });
        });
    }
    deleteContent(path, onComplete) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.rootRef.child(path)
                .transaction(_ => null, err => {
                if (!err)
                    constants_1.logger.info(`Realtime database service: Deleted content at ${path} for realtime database`);
                logError(err, onComplete);
            });
        });
    }
    runTransaction(transaction, path, onComplete, applyLocally) {
        return __awaiter(this, void 0, void 0, function* () {
            return (path ? this.rootRef.child(path) : this.rootRef)
                .transaction(a => transaction(a), (err, b, c) => {
                if (!err)
                    constants_1.logger.info(`Realtime database service: Ran transaction at ${path} for realtime database`);
                err && constants_1.logger.error(err);
                onComplete && onComplete(err, b, c);
            }, applyLocally);
        });
    }
}
exports.default = FirebaseRealtimeService;
//# sourceMappingURL=firebaseRealtimeService.js.map