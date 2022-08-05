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
const luxon_1 = require("luxon");
const constants_1 = require("../../../../constants");
const firebaseService_1 = require("./firebaseService");
const databaseCreateEvent_1 = __importDefault(require("../../../../model/v1/events/databaseCreateEvent"));
const databaseDeleteEvent_1 = __importDefault(require("../../../../model/v1/events/databaseDeleteEvent"));
const filterDatabaseEvent_1 = require("../../../../utility/filterDatabaseEvent");
const compression_1 = require("../../../../utility/compression");
const helper_1 = require("../../../../utility/helper");
const option_1 = require("../../../../model/patterns/option");
const databaseErrorEvent_1 = __importDefault(require("../../../../model/v1/events/databaseErrorEvent"));
const storage = firebaseService_1.persistentFirebaseConnection.storageService;
const SENSOR_FOLDER = "sensor";
const ACTUATOR_FOLDER = "actuator";
const LOG_FOLDER = "log";
function mergeDefaultDateRange(dateRange) {
    return {
        startDate: (dateRange === null || dateRange === void 0 ? void 0 : dateRange.startDate) || 0,
        endDate: (dateRange === null || dateRange === void 0 ? void 0 : dateRange.endDate) || luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger()
    };
}
function getSnapshotsFromDateRange(folderPath, dateRange, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        const [files] = yield storage.readFolderFromStorage(folderPath);
        if (!files)
            return option_1.None;
        constants_1.logger.info(`There are ${files.length} in ${folderPath}`);
        const result = [];
        for (const file of files) {
            const [metadata] = yield file.getMetadata();
            const rawFileName = metadata.name.match(/(?<=\/)[^\/]+(?=\.\w+)/g)[0];
            const fileName = Buffer.from(rawFileName, "base64").toString();
            const info = fileName.split(";").map(val => parseInt(val));
            constants_1.logger.info(info);
            const byteLength = info.pop();
            const [startDate, endDate] = info;
            if (endDate <= dateRange.startDate || startDate >= dateRange.endDate)
                continue;
            const downloadContent = yield file.download().then(res => res[0]);
            const decompressedData = (0, compression_1.decompressData)(downloadContent, byteLength).unwrapOr(null);
            decompressedData && result.push(filter ? filter(decompressedData) : decompressedData);
        }
        return result.length == 0 ? option_1.None : (0, option_1.Some)(result);
    });
}
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
const trimData = (data, key, dateRange) => {
    const lastIndex = data.length - 1;
    data[0][key] = data[0][key].filter((data) => higherCeiling(data, dateRange));
    data[lastIndex][key] = data[lastIndex][key].filter((data) => higherCeiling(data, dateRange));
};
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
const deleteSnapshots = (folderName, dateRange, publisher) => __awaiter(void 0, void 0, void 0, function* () {
    dateRange = mergeDefaultDateRange(dateRange);
    const event = new databaseDeleteEvent_1.default({
        protected: {
            storage() {
                return __awaiter(this, void 0, void 0, function* () {
                    const files = yield getSnapshotsFromDateRange(folderName, dateRange);
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
class DataSavingService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    retrieveSensorSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const option = yield getSnapshotsFromDateRange(SENSOR_FOLDER, dateRange);
            return option.map(data => {
                trimData(data, "sensorData", dateRange);
                return data.length == 0 ? option_1.None : (0, option_1.Some)(data);
            });
        });
    }
    retrieveSensorDataFromSnapshots(dateRange, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const data = yield getSnapshotsFromDateRange(SENSOR_FOLDER, dateRange, json => json.sensorData);
            return customFlat(data, dateRange, filter);
        });
    }
    retrieveActuatorSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            return null;
        });
    }
    retrieveSensorLogSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const data = yield getSnapshotsFromDateRange(LOG_FOLDER, dateRange, log => log.sensor);
            return customFlat(data, dateRange);
        });
    }
    retrieveActuatorLogSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const data = yield getSnapshotsFromDateRange(LOG_FOLDER, dateRange, log => log.actuator);
            return customFlat(data, dateRange);
        });
    }
    retrieveLogSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const option = yield getSnapshotsFromDateRange(LOG_FOLDER, dateRange);
            return option.map(data => {
                trimData(data, "sensor", dateRange);
                trimData(data, "actuator", dateRange);
                return data.length == 0 ? option_1.None : (0, option_1.Some)(data);
            });
        });
    }
    uploadSensorSnapshot(snapshot, dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            snapshot = {
                sensor: snapshot.sensor.sort((0, helper_1.orderByProp)("name")),
                sensorData: snapshot.sensorData.sort((0, helper_1.orderByProp)("sensorName"))
            };
            return yield uploadSnapshot(snapshot, dateRange, SENSOR_FOLDER, this.publisher, 257);
        });
    }
    uploadActuatorSnapshot(snapshot, dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            return null;
        });
    }
    uploadLogSnapshot(snapshot, dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            snapshot = {
                sensor: snapshot.sensor.sort((0, helper_1.orderByProp)("timeStamp")),
                actuator: snapshot.actuator.sort((0, helper_1.orderByProp)("timeStamp"))
            };
            return yield uploadSnapshot(snapshot, dateRange, LOG_FOLDER, this.publisher, 284);
        });
    }
    deleteSensorSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deleteSnapshots(SENSOR_FOLDER, dateRange, this.publisher);
        });
    }
    deleteActuatorSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deleteSnapshots(ACTUATOR_FOLDER, dateRange, this.publisher);
        });
    }
    deleteLogSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deleteSnapshots(LOG_FOLDER, dateRange, this.publisher);
        });
    }
}
exports.default = DataSavingService;
//# sourceMappingURL=dataSavingService.js.map