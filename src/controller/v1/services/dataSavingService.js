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
const constants_1 = require("../../../constants");
const firebaseService_1 = require("./firebaseService");
const databaseCreateEvent_1 = __importDefault(require("../../../model/v1/events/databaseCreateEvent"));
const databaseDeleteEvent_1 = __importDefault(require("../../../model/v1/events/databaseDeleteEvent"));
const filterDatabaseEvent_1 = require("../../../utility/filterDatabaseEvent");
const storage = firebaseService_1.persistConnection.storageService;
const SENSOR_FOLDER = "sensor";
const ACTUATOR_FOLDER = "actuator";
const LOG_FOLDER = "log";
function mergeDefaultDateRange(dateRange) {
    return {
        startDate: (dateRange === null || dateRange === void 0 ? void 0 : dateRange.startDate) || 0,
        endDate: (dateRange === null || dateRange === void 0 ? void 0 : dateRange.endDate) || luxon_1.DateTime.now().setZone(constants_1.databaseTimezone).toUnixInteger()
    };
}
function getSnapshotsFromDateRange(folderPath, dateRange) {
    return __awaiter(this, void 0, void 0, function* () {
        const [files] = yield storage.readFolderFromStorage(folderPath);
        const result = [];
        for (const file of files) {
            const [metadata] = yield file.getMetadata();
            const [startDate, endDate] = metadata.name.split("-").map((epoch) => parseInt(epoch));
            if (endDate <= dateRange.startDate || startDate >= dateRange.endDate)
                continue;
            result.push(file);
        }
        return result;
    });
}
class DataSavingService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    retrieveSensorSnapshot(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const files = yield getSnapshotsFromDateRange(SENSOR_FOLDER, dateRange);
            return null;
        });
    }
    retrieveActuatorSnapshot(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const files = yield getSnapshotsFromDateRange(ACTUATOR_FOLDER, dateRange);
            return null;
        });
    }
    retrieveLogSnapshot(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const files = yield getSnapshotsFromDateRange(LOG_FOLDER, dateRange);
            return null;
        });
    }
    uploadSensorSnapshot(snapshot, dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const event = new databaseCreateEvent_1.default({
                protected: {
                    storage() {
                        return __awaiter(this, void 0, void 0, function* () {
                        });
                    }
                }
            });
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
    uploadActuatorSnapshot(snapshot, dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const event = new databaseCreateEvent_1.default({
                protected: {
                    storage() {
                        return __awaiter(this, void 0, void 0, function* () {
                        });
                    }
                }
            });
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
    uploadLogSnapshot(snapshot, dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const event = new databaseCreateEvent_1.default({
                protected: {
                    storage() {
                        return __awaiter(this, void 0, void 0, function* () {
                        });
                    }
                }
            });
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
    deleteSnapshots(folderName, dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = mergeDefaultDateRange(dateRange);
            const event = new databaseDeleteEvent_1.default({
                protected: {
                    storage() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const files = yield getSnapshotsFromDateRange(folderName, dateRange);
                            for (const file of files) {
                                yield file.delete();
                            }
                        });
                    }
                }
            });
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
    deleteSensorSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.deleteSnapshots(SENSOR_FOLDER, dateRange);
        });
    }
    deleteActuatorSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.deleteSnapshots(ACTUATOR_FOLDER, dateRange);
        });
    }
    deleteLogSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.deleteSnapshots(LOG_FOLDER, dateRange);
        });
    }
}
exports.default = DataSavingService;
//# sourceMappingURL=dataSavingService.js.map