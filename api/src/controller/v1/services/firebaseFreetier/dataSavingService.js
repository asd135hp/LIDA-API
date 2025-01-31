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
const constants_1 = require("../../../../constants");
const firebaseService_1 = require("./firebaseService");
const databaseCreateEvent_1 = __importDefault(require("../../../../model/v1/events/databaseCreateEvent"));
const filterDatabaseEvent_1 = require("../../../../utility/filterDatabaseEvent");
const helper_1 = require("../../../../utility/helper");
const option_1 = require("../../../../model/patterns/option");
const databaseErrorEvent_1 = __importDefault(require("../../../../model/v1/events/databaseErrorEvent"));
const constants_2 = require("../../../../constants");
const dataSavingService_1 = require("./utility/dataSavingService");
const luxon_1 = require("luxon");
const fflate_1 = require("fflate");
const dataSavingServiceFacade_1 = require("../../../../model/v1/services/dataSavingServiceFacade");
const storage = firebaseService_1.persistentFirebaseConnection.storageService;
class DataSavingService extends dataSavingServiceFacade_1.DataSavingServiceFacade {
    retrieveSensorSnapshot(runNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderPath = `${constants_2.COMPONENTS_PATH.storage.sensor}/run${runNumber}`;
            const response = yield storage.readFolderFromStorage(folderPath);
            if (!response)
                return option_1.None;
            const [files] = response;
            if (!files.length)
                return option_1.None;
            constants_1.logger.debug(`There are ${files.length} in ${folderPath}`);
            const result = [];
            for (const file of files) {
                const [byteLength, _] = (0, dataSavingService_1.parseStorageFileMetaData)(yield file.getMetadata());
                const [signedUrl] = yield file.getSignedUrl({
                    action: "read",
                    expires: luxon_1.DateTime.now().toUTC().toUnixInteger() * 1000 + 1000 * 3600 * 24,
                });
                result.push({
                    newFileName: `lida_run${runNumber}.zip`,
                    downloadUrl: signedUrl,
                    decompressionByteLength: byteLength,
                    note: "The download link will expire today"
                });
            }
            return (0, option_1.Some)(result);
        });
    }
    retrieveSensorLogSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = (0, dataSavingService_1.mergeDefaultDateRange)(dateRange);
            const data = yield (0, dataSavingService_1.getSnapshotsFromDateRange)(`${constants_2.COMPONENTS_PATH.storage.log}/sensor`, dateRange);
            return (0, dataSavingService_1.customFlat)(data, dateRange);
        });
    }
    retrieveActuatorLogSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = (0, dataSavingService_1.mergeDefaultDateRange)(dateRange);
            const data = yield (0, dataSavingService_1.getSnapshotsFromDateRange)(`${constants_2.COMPONENTS_PATH.storage.log}/actuator`, dateRange);
            return (0, dataSavingService_1.customFlat)(data, dateRange);
        });
    }
    retrieveSystemCommandLogSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = (0, dataSavingService_1.mergeDefaultDateRange)(dateRange);
            const data = yield (0, dataSavingService_1.getSnapshotsFromDateRange)(`${constants_2.COMPONENTS_PATH.storage.log}/systemCommand`, dateRange);
            return (0, dataSavingService_1.customFlat)(data, dateRange);
        });
    }
    uploadSensorSnapshot(snapshots, runNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderName = `${constants_2.COMPONENTS_PATH.storage.sensor}/run${runNumber}`;
            const sensorName = snapshots.sensor.sort((0, helper_1.orderByProp)("name"));
            const sensorData = new Object();
            snapshots.data.map((obj, systemDay) => {
                Object.assign(sensorData, {
                    [`day#${systemDay}`]: obj
                });
            });
            const event = new databaseCreateEvent_1.default({
                protected: {
                    storage() {
                        return __awaiter(this, void 0, void 0, function* () {
                            let buffer = null;
                            (0, fflate_1.zip)({
                                "sensor_names_and_statuses.json": [(0, fflate_1.strToU8)(JSON.stringify(sensorName)), {}],
                                "sensor_data.json": [(0, fflate_1.strToU8)(JSON.stringify(sensorData)), {}]
                            }, { level: 9 }, (err, data) => {
                                if (err)
                                    throw err;
                                buffer = Buffer.from(data);
                                storage.uploadBytesToStorage(`${folderName}/${buffer.byteLength}.zip`, buffer).then(() => {
                                    constants_1.logger.debug("It worked ~ DataSavingService.ts line 128");
                                }, (reason) => {
                                    constants_1.logger.error(`Error: ${reason} ~ DataSavingService.ts line 130`);
                                });
                            });
                        });
                    }
                }
            });
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event)).unwrapOrElse(() => {
                constants_1.logger.error("DataSavingService: DatabaseEvent filtration leads to all error ~ 119");
                return new databaseErrorEvent_1.default("The action is failed to be executed", 400);
            });
        });
    }
    uploadLogSnapshot(snapshot, dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = (0, dataSavingService_1.mergeDefaultDateRange)(dateRange);
            snapshot = {
                sensor: snapshot.sensor.sort((0, helper_1.orderByProp)("timeStamp")),
                actuator: snapshot.actuator.sort((0, helper_1.orderByProp)("timeStamp")),
                systemCommand: snapshot.systemCommand.sort((0, helper_1.orderByProp)("timeStamp"))
            };
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)([
                yield (0, dataSavingService_1.uploadSnapshot)(snapshot.sensor, dateRange, `${constants_2.COMPONENTS_PATH.storage.log}/sensor`, this.publisher, 282),
                yield (0, dataSavingService_1.uploadSnapshot)(snapshot.actuator, dateRange, `${constants_2.COMPONENTS_PATH.storage.log}/actuator`, this.publisher, 283),
                yield (0, dataSavingService_1.uploadSnapshot)(snapshot.systemCommand, dateRange, `${constants_2.COMPONENTS_PATH.storage.log}/systemCommand`, this.publisher, 284),
            ], databaseCreateEvent_1.default).unwrapOr(new databaseErrorEvent_1.default("Could not retrieve saved log snapshots", 404));
        });
    }
    deleteSensorSnapshot(runNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, dataSavingService_1.deleteSnapshots)(`${constants_2.COMPONENTS_PATH.storage.sensor}/run${runNumber}`, (0, dataSavingService_1.mergeDefaultDateRange)({}), this.publisher);
        });
    }
    deleteLogSnapshots(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, dataSavingService_1.deleteSnapshots)(constants_2.COMPONENTS_PATH.storage.log, dateRange, this.publisher);
        });
    }
}
exports.default = DataSavingService;
//# sourceMappingURL=dataSavingService.js.map