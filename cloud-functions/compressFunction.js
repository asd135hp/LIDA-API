"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSensorSnapshot = exports.saveSensorSnapshot = void 0;
const fflate_1 = require("fflate");
const firestore_1 = require("@google-cloud/firestore");
const storage_1 = require("@google-cloud/storage");
const firestore = new firestore_1.Firestore({ projectId: process.env.GOOGLE_CLOUD_PROJECT });
const storage = new storage_1.Storage({ projectId: process.env.GOOGLE_CLOUD_PROJECT });
const fileExtension = ".zip";
function compressJsonDataSync(json, dateRange) {
    try {
        let name = `${dateRange.startDate};${dateRange.endDate}`;
        const byteArr = (0, fflate_1.strToU8)(JSON.stringify(json));
        const compressedData = (0, fflate_1.zlibSync)(byteArr, { level: 9 });
        name += `;${byteArr.byteLength}`;
        const fileName = `${Buffer.from(name, "ascii").toString("base64")}.${fileExtension}`;
        return { fileName, compressedData };
    }
    catch (err) {
        return null;
    }
}
function decompressData(compressedData, outLength) {
    try {
        const rawDecompressed = (0, fflate_1.decompressSync)(compressedData, outLength ? new Uint8Array(outLength) : null);
        const jsonStr = (0, fflate_1.strFromU8)(rawDecompressed);
        return JSON.parse(jsonStr);
    }
    catch (err) {
        return null;
    }
}
const saveSensorSnapshot = event => {
    return event;
};
exports.saveSensorSnapshot = saveSensorSnapshot;
const getSensorSnapshot = event => {
    return event;
};
exports.getSensorSnapshot = getSensorSnapshot;
//# sourceMappingURL=compressFunction.js.map