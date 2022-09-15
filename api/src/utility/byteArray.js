"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byteArrayToString = exports.stringToByteArray = void 0;
function stringToByteArray(str) {
    const byteArray = new Array();
    for (let i = 0; i < str.length; i++)
        byteArray.push(str.charCodeAt(i));
    return new Uint8Array(byteArray);
}
exports.stringToByteArray = stringToByteArray;
function byteArrayToString(byteArray, encoding) {
    return Buffer.from(byteArray).toString(encoding || "utf-8");
}
exports.byteArrayToString = byteArrayToString;
//# sourceMappingURL=byteArray.js.map