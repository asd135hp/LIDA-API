"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zlib_1 = __importDefault(require("zlib"));
const fs_1 = __importDefault(require("fs"));
class CompressionService {
    constructor(gzipFileName, options) {
        this.gzipObject = zlib_1.default.createGzip({});
    }
    addFile(content, fileName) {
        const writeStream = fs_1.default.createWriteStream(fileName || "");
        return null;
    }
    addFileFromBuffer(readStream) { readStream.pipe(this.gzipObject); }
    uncompressFile() {
    }
    compress() {
        const destination = fs_1.default.createWriteStream("randomStringHere.tar.gz");
        this.gzipObject.pipe(destination);
    }
}
exports.default = CompressionService;
//# sourceMappingURL=compressionService.js.map