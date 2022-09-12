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
exports.deleteSnapshots = exports.uploadSnapshot = exports.customFlat = exports.getSnapshotsFromDateRange = exports.parseStorageFileMetaData = exports.mergeDefaultDateRange = void 0;
const luxon_1 = require("luxon");
const constants_1 = require("../../../../../constants");
const databaseCreateEvent_1 = __importDefault(require("../../../../../model/v1/events/databaseCreateEvent"));
const databaseDeleteEvent_1 = __importDefault(require("../../../../../model/v1/events/databaseDeleteEvent"));
const databaseErrorEvent_1 = __importDefault(require("../../../../../model/v1/events/databaseErrorEvent"));
const compression_1 = require("../../../../../utility/compression");
const filterDatabaseEvent_1 = require("../../../../../utility/filterDatabaseEvent");
const firebaseService_1 = require("../firebaseService");
const option_1 = require("../../../../../model/patterns/option");
const storage = firebaseService_1.persistentFirebaseConnection.storageService;
function mergeDefaultDateRange(dateRange) {
    return {
        startDate: (dateRange === null || dateRange === void 0 ? void 0 : dateRange.startDate) || 0,
        endDate: (dateRange === null || dateRange === void 0 ? void 0 : dateRange.endDate) || luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger()
    };
}
exports.mergeDefaultDateRange = mergeDefaultDateRange;
function parseStorageFileMetaData(rawMetaData) {
    const [metadata] = rawMetaData;
    const rawFileName = metadata.name.split(/[\/\\]/).pop().split('.')[0];
    return [parseInt(rawFileName), metadata];
}
exports.parseStorageFileMetaData = parseStorageFileMetaData;
function getSnapshotsFromDateRange(folderPath, dateRange, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const [files] = yield storage.readFolderFromStorage(folderPath);
        if (!files)
            return option_1.None;
        constants_1.logger.debug(`There are ${files.length} in ${folderPath}`);
        const result = [];
        options = options !== null && options !== void 0 ? options : { downloadData: true };
        for (const file of files) {
            const [startDate, endDate, byteLength] = parseStorageFileMetaData(yield file.getMetadata());
            if (endDate <= dateRange.startDate || startDate >= dateRange.endDate)
                continue;
            if (options.downloadData) {
                const downloadContent = yield file.download().then(res => res[0]);
                const decompressedData = (0, compression_1.decompressData)(downloadContent, byteLength).unwrapOr(null);
                decompressedData && result.push(options.filter ? options.filter(decompressedData) : decompressedData);
                continue;
            }
            result.push((0, option_1.Some)(""));
        }
        return result.length == 0 ? option_1.None : (0, option_1.Some)(result);
    });
}
exports.getSnapshotsFromDateRange = getSnapshotsFromDateRange;
const lowerCeiling = (data, dateRange) => data.timeStamp >= dateRange.startDate, higherCeiling = (data, dateRange) => data.timeStamp <= dateRange.endDate;
const customFlat = (option, dateRange, filter) => {
    const result = [];
    option.unwrapOr([]).map((dataByDay, index) => {
        if (!Array.isArray(dataByDay))
            return;
        for (const data of dataByDay) {
            if (index != 0 || index != data.length - 1
                || (lowerCeiling(data, dateRange) && higherCeiling(data, dateRange) && (!filter || filter(data))))
                result.push(data);
        }
    });
    return result.length == 0 ? option_1.None : (0, option_1.Some)(result);
};
exports.customFlat = customFlat;
const uploadSnapshot = (snapshot, dateRange, folder, publisher, errorOccurrenceLine) => __awaiter(void 0, void 0, void 0, function* () {
    const event = new databaseCreateEvent_1.default({
        protected: {
            storage() {
                return __awaiter(this, void 0, void 0, function* () {
                    const option = (0, compression_1.compressJsonDataSync)(snapshot, dateRange);
                    if (option.match.isNone())
                        Promise.reject();
                    const result = option.unwrapOr(null);
                    if (!result)
                        return;
                    result.fileName = `${folder}/${result.fileName}`;
                    yield storage.uploadBytesToStorage(result.fileName, Buffer.from(result.compressedData));
                });
            }
        }
    });
    return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield publisher.notifyAsync(event)).unwrapOrElse(() => {
        constants_1.logger.error("DataSavingService: DatabaseEvent filtration leads to all error ~ " + errorOccurrenceLine);
        return new databaseErrorEvent_1.default("The action is failed to be executed", 400);
    });
});
exports.uploadSnapshot = uploadSnapshot;
const deleteSnapshots = (folderName, dateRange, publisher) => __awaiter(void 0, void 0, void 0, function* () {
    dateRange = mergeDefaultDateRange(dateRange);
    const event = new databaseDeleteEvent_1.default({
        protected: {
            storage() {
                return __awaiter(this, void 0, void 0, function* () {
                    const files = yield getSnapshotsFromDateRange(folderName, dateRange, { downloadData: false });
                    for (const { byteLength, file } of files.unwrapOr([])) {
                        yield file.delete();
                    }
                });
            }
        }
    });
    return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield publisher.notifyAsync(event)).unwrapOrElse(() => {
        constants_1.logger.error("DataSavingService: DatabaseEvent filtration leads to all error ~ 289");
        return new databaseErrorEvent_1.default("The action is failed to be executed", 400);
    });
});
exports.deleteSnapshots = deleteSnapshots;
//# sourceMappingURL=dataSavingService.js.map