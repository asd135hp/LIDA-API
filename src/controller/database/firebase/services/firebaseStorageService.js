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
function retry(callback, options) {
    return __awaiter(this, void 0, void 0, function* () {
        options.maxRetries = (options === null || options === void 0 ? void 0 : options.maxRetries) || 10;
        options.maxResponseTime = (options === null || options === void 0 ? void 0 : options.maxResponseTime) || 100;
        if (options.maxRetries == 0)
            return Promise.reject("Max retries reached while failing to verify source data");
        return callback().catch(() => retry(callback, Object.assign({ maxRetries: options.maxRetries - 1 }, options)));
    });
}
class FirebaseStorageService {
    constructor(firebaseApp, rootFolder) {
        this.bucket = firebase_admin_1.default.storage(firebaseApp).bucket();
        this.rootFolder = rootFolder || "";
        this.encoding = "utf-8";
    }
    get path() {
        return this.rootFolder && this.currentName ?
            `${this.rootFolder}/${this.currentName}` : this.rootFolder || this.currentName;
    }
    changeEncoding(encoding) {
        this.encoding = encoding;
        return this;
    }
    isFileExists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentName = name;
            return this.bucket.file(this.path).exists()
                .then(res => {
                constants_1.logger.info(`Storage service: File "${this.path}" ${res[0] ? "exists" : "does not exists"}`);
                return res[0];
            }).catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    readFileFromStorage(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentName = name;
            return this.bucket.file(this.path).download()
                .then(res => (constants_1.logger.info(`Storage service: Downloaded file: ${this.path}`), res[0]))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    readFolderFromStorage(folderName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentName = folderName;
            return yield this.bucket.getFiles(Object.assign({ prefix: this.path }, options))
                .then(res => (constants_1.logger.info(`Storage service: Got response from folder in the storage: ${this.path}`), res))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    uploadBytesToStorage(name, content, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentName = name;
            if (typeof (content) === 'string')
                content = Buffer.from(content).toString(this.encoding);
            return this.bucket.file(this.path).save(content, options)
                .then(res => {
                constants_1.logger.info(`Storage service: Uploaded file named ${this.path} to the bucket with response: ${res}`);
                return res;
            })
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    appendBytesToFile(name, content, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentName = name;
            return retry(() => __awaiter(this, void 0, void 0, function* () {
                const file = this.bucket.file(this.path);
                if ((yield file.exists())[0])
                    return;
                const initialHash = (yield file.getMetadata())[0].md5Hash;
                const [oldContent] = yield file.download();
                if (typeof (content) !== 'string')
                    content = content.toString(this.encoding);
                oldContent.write(content, this.encoding);
                if (initialHash != (yield file.getMetadata())[0].md5Hash)
                    return Promise.reject();
                return file.save(oldContent, options)
                    .then(res => {
                    constants_1.logger.info(`Storage service: Uploaded file named ${this.path} to the bucket with response: ${res}`);
                    return res;
                });
            })).catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    deleteFileFromStorage(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentName = name;
            return yield this.bucket.file(this.path).delete({ ignoreNotFound: true })
                .then(res => (constants_1.logger.info(`Storage service: Deleted file named ${name}`), res))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
    deleteFolderFromStorage(folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentName = folderName;
            yield this.bucket.deleteFiles({ prefix: this.path })
                .then(res => (constants_1.logger.info(`Storage service: Deleted folder with directory of ${folderName}`), res))
                .catch(constants_1.PROMISE_CATCH_METHOD);
        });
    }
}
exports.default = FirebaseStorageService;
//# sourceMappingURL=firebaseStorageService.js.map