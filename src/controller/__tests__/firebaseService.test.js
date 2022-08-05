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
const promises_1 = require("timers/promises");
const constants_1 = require("../../constants");
const encryption_1 = require("../../utility/encryption");
const firebaseService_1 = require("../v1/services/firebaseFreetier/firebaseService");
describe("Test firebase service as a whole", () => {
    const service = firebaseService_1.persistentFirebaseConnection;
    const TIMEOUT = 1000 * 10;
    test("Test firebase storage service", () => __awaiter(void 0, void 0, void 0, function* () {
        const storage = service === null || service === void 0 ? void 0 : service.storageService;
        if (!storage)
            return;
        const testFile = "text1.txt";
        yield storage.uploadBytesToStorage("Hello", testFile).catch(reason => expect(reason).toBe(undefined));
        yield storage.readFileFromStorage(testFile)
            .then(result => {
            expect(result).not.toBe(undefined);
            expect(result.length).not.toBe(0);
        })
            .catch(reason => expect(reason).toBe(undefined));
        yield storage.deleteFileFromStorage(testFile).catch(reason => expect(reason).toBe(null));
        yield storage.readFileFromStorage(testFile)
            .then(result => {
            expect(result).toBe(undefined);
        })
            .catch(reason => expect(reason).not.toBe(null));
    }), TIMEOUT);
    describe("Test firebase firestore database", () => {
        const documentPath = "test/test1";
        const firestore = service.firestoreService;
        test("Should create a document in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            yield firestore.createDocument(documentPath, { "value": "Hello" });
            const document = yield firestore.getDocument(documentPath);
            expect(document).not.toBe(undefined);
            expect(document.get("value")).toBe("Hello");
        }), TIMEOUT);
        test("Should update the document in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            yield firestore.updateDocument(documentPath, { "val": "1" });
            const document = yield firestore.getDocument(documentPath);
            expect(document).not.toBe(undefined);
            expect(document.get("value")).toBe("Hello");
            expect(document.get("val")).toBe(undefined);
        }), TIMEOUT);
        test("Should set the document in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            yield firestore.setDocument(documentPath, { "j": "k" });
            const document = yield firestore.getDocument(documentPath);
            expect(document).not.toBe(undefined);
            expect(document.get("j")).toBe("k");
            expect(document.get("value")).not.toBe("Hello");
            expect(document.get("idle")).not.toBe("true");
        }), TIMEOUT);
        test("Should delete the document in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            yield firestore.deleteDocument(documentPath);
            expect((yield firestore.getDocument(documentPath)).data()).toBe(undefined);
        }), TIMEOUT);
    });
    describe("Test firebase realtime database", () => {
        const path = "test";
        const realTime = service.realtimeService;
        test("Should set new content to the database", () => __awaiter(void 0, void 0, void 0, function* () {
            yield realTime.setContent({ "test": "Hello" }, path);
            const contentSet = yield realTime.getContent(path);
            expect(contentSet.exists()).toBe(true);
            expect(contentSet.hasChild("test")).toBe(true);
            expect(contentSet.numChildren()).toBe(1);
            expect(typeof (contentSet.val())).toBe("object");
            expect(contentSet.val()['test']).toBe("Hello");
        }), TIMEOUT);
        test("Should push new content to the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const key = yield realTime.pushContent({ "test1": "Test123" }, path).then(ref => ref.key);
            const contentPush = yield realTime.getContent(path, ref => ref.child(key).get());
            expect(contentPush.exists()).toBe(true);
            expect(contentPush.hasChild("test1")).toBe(true);
            expect(contentPush.numChildren()).toBe(1);
            expect(typeof (contentPush.val())).toBe("object");
            expect(contentPush.val()['test1']).toBe("Test123");
        }), TIMEOUT);
        test("Should update new content to the database", () => __awaiter(void 0, void 0, void 0, function* () {
            yield realTime.updateContent({ "test": "GoodBye" }, path);
            const contentUpdate = yield realTime.getContent(path);
            expect(contentUpdate.exists()).toBe(true);
            expect(contentUpdate.hasChild("test")).toBe(true);
            expect(typeof (contentUpdate.val())).toBe("object");
            expect(contentUpdate.val()['test']).toBe("GoodBye");
        }), TIMEOUT);
        test("Should delete content from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            yield realTime.deleteContent(`${path}/test`);
            const contentDelete = yield realTime.getContent(path);
            expect(contentDelete.exists()).toBe(true);
            expect(contentDelete.hasChild("test")).not.toBe(true);
            expect(typeof (contentDelete.val())).toBe("object");
            expect(contentDelete.val()['test']).not.toBe("Hello");
        }), TIMEOUT);
    });
    test("Test firebase authentication", () => __awaiter(void 0, void 0, void 0, function* () {
        const auth = service === null || service === void 0 ? void 0 : service.authService;
        if (!auth)
            return;
        const { email, password } = constants_1.TEST_ACCOUNT;
        yield auth.registerWithEmail(email, password).catch(() => __awaiter(void 0, void 0, void 0, function* () {
        }));
        yield (0, promises_1.setTimeout)(2000);
        let user = yield auth.loginWithEmail(email, password).catch(() => null);
        expect(user).not.toBe(null);
        expect(user.email).toBe(email);
        const [uid, apiKey] = (0, encryption_1.asymmetricKeyDecryption)(user.accessToken).split("|");
        expect(yield auth.verifyApiKey(uid, apiKey)).toBe(true);
        user = yield auth.reauthenticationWithEmail(email, password);
        const [_, newApiKey] = (0, encryption_1.asymmetricKeyDecryption)(user.accessToken).split("|");
        expect(newApiKey).not.toBe(apiKey);
        yield auth.deleteUser(uid, newApiKey);
        auth.logout(user);
        expect(user.isLoggedOut).toBe(true);
    }), TIMEOUT * 2 + 2000);
});
//# sourceMappingURL=firebaseService.test.js.map