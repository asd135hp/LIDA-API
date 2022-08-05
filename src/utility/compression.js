"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompressData = exports.compressJsonDataSync = void 0;
const fflate_1 = require("fflate");
const constants_1 = require("../constants");
const option_1 = require("../model/patterns/option");
function compressJsonDataSync(json, dateRange) {
    try {
        let name = `${dateRange.startDate};${dateRange.endDate}`;
        const byteArr = (0, fflate_1.strToU8)(JSON.stringify(json));
        const compressedData = (0, fflate_1.zlibSync)(byteArr, { level: 9 });
        name += `;${byteArr.byteLength}`;
        const fileName = `${Buffer.from(name, "ascii").toString("base64")}.${constants_1.COMPRESSION_SETTINGS.fileExtension}`;
        return (0, option_1.Some)({ fileName, compressedData });
    }
    catch (err) {
        constants_1.logger.error("CompressJsonDataSync - Data compression failed with the following error: " + err);
        return option_1.None;
    }
}
exports.compressJsonDataSync = compressJsonDataSync;
function decompressData(compressedData, outLength) {
    try {
        const rawDecompressed = (0, fflate_1.decompressSync)(compressedData, outLength ? new Uint8Array(outLength) : null);
        const jsonStr = (0, fflate_1.strFromU8)(rawDecompressed);
        return (0, option_1.Some)(JSON.parse(jsonStr));
    }
    catch (err) {
        constants_1.logger.error("DecompressData - Data decompression failed with following error: " + err);
        return option_1.None;
    }
}
exports.decompressData = decompressData;
//# sourceMappingURL=compression.js.map