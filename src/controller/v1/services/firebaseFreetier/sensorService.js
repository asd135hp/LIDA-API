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
const sensorDto_1 = require("../../../../model/v1/read/sensorDto");
const databaseAddEvent_1 = __importDefault(require("../../../../model/v1/events/databaseAddEvent"));
const databaseUpdateEvent_1 = __importDefault(require("../../../../model/v1/events/databaseUpdateEvent"));
const firebaseService_1 = require("./firebaseService");
const firebaseRealtimeService_1 = require("../../../database/firebase/services/firebaseRealtimeService");
const luxon_1 = require("luxon");
const dataSavingService_1 = __importDefault(require("./dataSavingService"));
const option_1 = require("../../../../model/patterns/option");
const shorthandOps_1 = require("../../../../utility/shorthandOps");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
const realtimeSensor = "sensors";
const realtimeSensorData = "sensorData";
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
const firestoreSensor = "sensors";
const firestoreSensorData = "sensorData";
class SensorService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    getSensors() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeSensor, null, { limitToFirst: constants_1.SENSOR_LIMIT });
            constants_1.logger.debug(`All sensors: ${result}`);
            return result.map(arr => {
                const newArr = arr.map((val) => sensorDto_1.SensorDTO.fromJson(val));
                return (0, option_1.Some)(newArr);
            });
        });
    }
    getSensorsByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeSensor, "type", { equalToValue: type });
            constants_1.logger.debug(`Sensors by type: ${result}`);
            return result.map(arr => {
                const newArr = arr.map((val) => sensorDto_1.SensorDTO.fromJson(val));
                return (0, option_1.Some)(newArr);
            });
        });
    }
    getSensorByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeSensor, "name", { equalToValue: name });
            constants_1.logger.debug(`Sensor by name: ${result}`);
            return result.map(arr => {
                const sensor = sensorDto_1.SensorDTO.fromJson(arr[0]);
                return (0, option_1.Some)(sensor);
            });
        });
    }
    getSensorData(dateRange = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange.startDate = dateRange.startDate || 0;
            dateRange.endDate = dateRange.endDate || luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger();
            const dataSavingService = new dataSavingService_1.default();
            let result = yield dataSavingService.retrieveSensorDataFromSnapshots(dateRange);
            yield realtime.getContent(realtimeSensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                const temp = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("timeStamp"), json => {
                    const timestamp = json.timeStamp;
                    return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate;
                });
                const newResult = result.unwrapOr([]).concat(temp.unwrapOr([]));
                result = newResult.length == 0 ? option_1.None : (0, option_1.Some)(newResult);
            }));
            constants_1.logger.debug(`Sensor data by name: ${result}`);
            return result.map(data => {
                const arr = data.map(val => sensorDto_1.SensorDataDTO.fromJson(val));
                return (0, option_1.Some)(arr);
            });
        });
    }
    getSensorDataByName(name, dateRange = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange.startDate = dateRange.startDate || 0;
            dateRange.endDate = dateRange.endDate || luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger();
            const dataSavingService = new dataSavingService_1.default();
            let result = yield dataSavingService.retrieveSensorDataFromSnapshots(dateRange, json => json.sensorName == name);
            yield realtime.getContent(realtimeSensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                const temp = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("sensorName").equalTo(name), json => {
                    const timestamp = json.timeStamp;
                    return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate;
                });
                const newResult = result.unwrapOr([]).concat(temp.unwrapOr([]));
                result = newResult.length == 0 ? option_1.None : (0, option_1.Some)(newResult);
            }));
            constants_1.logger.debug(`Sensor data by name: ${result}`);
            return result.map(data => {
                const arr = data.map(val => sensorDto_1.SensorDataDTO.fromJson(val));
                return (0, option_1.Some)(arr);
            });
        });
    }
    addSensor(sensor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (sensor.isRunning) === 'undefined')
                sensor.isRunning = true;
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: sensor,
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const result = yield firestore.queryCollection(firestoreSensor, collectionRef => collectionRef.where("name", "==", sensor.name).get());
                            if (!result.empty) {
                                constants_1.logger.error(`An sensor of the same name has already existed in the database: "${sensor.name}"`);
                                return Promise.reject(`400An sensor with the same name "${sensor.name}" has already existed in the database`);
                            }
                            yield firestore.addContentToCollection(firestoreSensor, sensor);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeSensor, "name", {
                                equalToValue: sensor.name
                            });
                            if (result.match.isNone())
                                yield realtime.pushContent(sensor, realtimeSensor);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 187"
            }, databaseAddEvent_1.default);
        });
    }
    updateSensor(sensor) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: sensor,
                protectedMethods: {
                    write(currentEvent) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const docs = (yield firestore.queryCollection(firestoreSensor, collectionRef => collectionRef.where("name", "==", sensor.name).get())).docs;
                            if (docs.length == 0)
                                return Promise.reject("404Specified name does not match with anything in the database");
                            if (docs.length > 1) {
                                currentEvent.content.warning = "Ambiguity: There are more than 2 sensors with the same name!";
                                return Promise.reject("400Could not update sensor details due to ambiguity");
                            }
                            yield firestore.updateDocument(docs[0].id, sensor);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield realtime.getContent(realtimeSensor, (ref) => __awaiter(this, void 0, void 0, function* () {
                                let isValid = false;
                                let key = "";
                                yield ref.orderByChild("name").equalTo(sensor.name).once("child_added", child => {
                                    if (isValid = child.exists())
                                        key = child.key;
                                });
                                if (isValid && key) {
                                    realtime.updateContent(sensor, `${realtimeSensor}/${key}`);
                                    return;
                                }
                                Promise.reject(`404Could not find sensor named "${sensor.name}"`);
                            }));
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 239"
            }, databaseUpdateEvent_1.default);
        });
    }
    addSensorData(sensorName, sensorData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: Object.assign({ sensorName }, sensorData),
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const result = yield firestore.queryCollection(firestoreSensor, collectionRef => collectionRef.where("name", "==", sensorName).get());
                            if (result.empty)
                                return Promise.reject("404Specified sensor name does not match with anything in the database");
                            yield firestore.addContentToCollection(firestoreSensorData, Object.assign({ sensorName }, sensorData));
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeSensor, "name", {
                                equalToValue: sensorName
                            });
                            if (result.match.isNone())
                                return Promise.reject(`404Could not find corresponding sensor name "${sensorName}"`);
                            yield realtime.pushContent(Object.assign({ sensorName }, sensorData), realtimeSensorData);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 194"
            }, databaseAddEvent_1.default);
        });
    }
}
exports.default = SensorService;
//# sourceMappingURL=sensorService.js.map