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
const constants_1 = require("../../../../constants");
class FirebaseFirestoreService {
    constructor(firebaseApp, rootDocPath) {
        this.firestore = firebase_admin_1.default.firestore(firebaseApp);
        this.rootDoc = rootDocPath ? this.firestore.doc(rootDocPath) : null;
    }
    get path() {
        return this.rootDoc && this.currentDocPath ?
            `${this.rootDoc.path}/${this.currentDocPath}` : (this.currentDocPath || this.rootDoc.path);
    }
    getCollection(collectionPath) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return ((_a = this.rootDoc) !== null && _a !== void 0 ? _a : this.firestore).collection(collectionPath).get()
                .then(snapshot => {
                constants_1.logger.info(`Firestore service: Got collection at ${snapshot.empty && snapshot.docs[0].ref.parent.path}`);
                return snapshot;
            })
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    queryCollection(collectionPath, callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return callback(((_a = this.rootDoc) !== null && _a !== void 0 ? _a : this.firestore).collection(collectionPath))
                .then(snapshot => {
                constants_1.logger.info(`Firestore service: Got collection at ${!snapshot.empty && snapshot.docs[0].ref.parent.path}`);
                return snapshot;
            })
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    addContentToCollection(collectionPath, content, parentDocument) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return ((_a = parentDocument !== null && parentDocument !== void 0 ? parentDocument : this.rootDoc) !== null && _a !== void 0 ? _a : this.firestore).collection(collectionPath).add(content)
                .then(ref => (constants_1.logger.info(`Firestore service: Created new document at ${ref.path}`), ref))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    getDocument(documentPath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentDocPath = documentPath;
            return this.firestore.doc(this.path).get()
                .then(snapshot => (constants_1.logger.info(`Firestore service: Got document at ${this.path}`), snapshot))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    createDocument(documentPath, content) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentDocPath = documentPath;
            return this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                const currentDoc = yield t.get(this.firestore.doc(this.path));
                t.create(currentDoc.ref, content);
            })).then(res => (constants_1.logger.info(`Firestore service: Created document at ${this.path}`), res))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    setDocument(documentPath, content) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentDocPath = documentPath;
            return this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                const currentDoc = yield t.get(this.firestore.doc(this.path));
                t.set(currentDoc.ref, content);
            })).then(res => (constants_1.logger.info(`Firestore service: Set document at ${this.path}`), res))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    updateDocument(documentPath, content, precondition) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentDocPath = documentPath;
            return this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                const currentDoc = yield t.get(this.firestore.doc(this.path));
                t.update(currentDoc.ref, content, precondition);
            })).then(res => (constants_1.logger.info(`Firestore service: Updated document at ${this.path}`), res))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    deleteDocument(documentPath, precondition) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentDocPath = documentPath;
            return this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                const currentDoc = yield t.get(this.firestore.doc(this.path));
                t.delete(currentDoc.ref, precondition);
            })).then(res => (constants_1.logger.info(`Firestore service: Deleted document at ${this.path}`), res))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    deleteCollection(collectionPath) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const path = `${(_a = this.rootDoc) === null || _a === void 0 ? void 0 : _a.path}/${collectionPath}`;
            const collection = yield this.firestore.collection(path).get();
            for (const doc of collection.docs)
                yield this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () { return t.delete(doc.ref); }))
                    .catch(reason => reason && constants_1.logger.error(reason));
        });
    }
    runTransaction(documentPath, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentDocPath = documentPath;
            return yield this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                const currentDoc = yield t.get(this.firestore.doc(this.path));
                return yield transaction(currentDoc, t);
            })).then(res => (constants_1.logger.info(`Firestore service: Ran custom transaction at ${this.path}`), res))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
}
exports.default = FirebaseFirestoreService;
//# sourceMappingURL=firebaseFirestoreService.js.map