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
const databaseEvent_1 = __importDefault(require("../../../../model/v1/events/databaseEvent"));
const sensorDto_1 = require("../../../../model/v1/read/sensorDto");
const databaseAddEvent_1 = __importDefault(require("../../../../model/v1/events/databaseAddEvent"));
const databaseUpdateEvent_1 = __importDefault(require("../../../../model/v1/events/databaseUpdateEvent"));
const firebaseService_1 = require("./firebaseService");
const firebaseRealtimeService_1 = require("../../../database/firebase/services/firebaseRealtimeService");
const luxon_1 = require("luxon");
const option_1 = require("../../../../model/patterns/option");
const shorthandOps_1 = require("../../../../utility/shorthandOps");
const constants_2 = require("../../../../constants");
const helper_1 = require("../../../../utility/helper");
const databaseDeleteEvent_1 = __importDefault(require("../../../../model/v1/events/databaseDeleteEvent"));
const sensorServiceFacade_1 = require("../../../../model/v1/services/sensorServiceFacade");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
class SensorService extends sensorServiceFacade_1.SensorServiceFacade {
    getSensors() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_2.COMPONENTS_PATH.sensor, null, { limitToFirst: constants_1.SENSOR_LIMIT });
            constants_1.logger.debug(`All sensors: ${result}`);
            return result.map(arr => {
                const newArr = arr.map((val) => sensorDto_1.SensorDTO.fromJson(val));
                return (0, option_1.Some)(newArr);
            });
        });
    }
    getSensorsByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_2.COMPONENTS_PATH.sensor, "type", { equalToValue: type });
            constants_1.logger.debug(`Sensors by type: ${result}`);
            return result.map(arr => {
                const newArr = arr.map((val) => sensorDto_1.SensorDTO.fromJson(val));
                return (0, option_1.Some)(newArr);
            });
        });
    }
    getSensorByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_2.COMPONENTS_PATH.sensor, "name", { equalToValue: name });
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
            let result = option_1.None;
            yield realtime.getContent(constants_2.COMPONENTS_PATH.sensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                result = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByKey(), json => {
                    const timestamp = json.timeStamp;
                    constants_1.logger.debug("Get sensor data - timeStamp: " + json.timeStamp);
                    return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate;
                });
            }));
            constants_1.logger.debug(`Sensor data by name: ${result}`);
            return result.map(data => {
                const arr = data.map(val => sensorDto_1.SensorDataDTO.fromJson(val)).sort((0, helper_1.orderByProp)("timeStamp", false));
                return (0, option_1.Some)(arr);
            });
        });
    }
    getSensorDataByName(name, dateRange = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange.startDate = dateRange.startDate || 0;
            dateRange.endDate = dateRange.endDate || luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger();
            let result = option_1.None;
            yield realtime.getContent(constants_2.COMPONENTS_PATH.sensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                result = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("sensorName").equalTo(name), json => {
                    const timestamp = json.timeStamp;
                    return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate;
                });
            }));
            constants_1.logger.debug(`Sensor data by name: ${result}`);
            return result.map(data => {
                const arr = data.map(val => sensorDto_1.SensorDataDTO.fromJson(val)).sort((0, helper_1.orderByProp)("timeStamp", false));
                return (0, option_1.Some)(arr);
            });
        });
    }
    getSensorDataSnapshot(dateRange = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange = {
                startDate: dateRange.startDate || 0,
                endDate: dateRange.endDate || luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger()
            };
            const cachedEndDate = luxon_1.DateTime.fromSeconds(dateRange.endDate);
            const boundTimeObj = luxon_1.DateTime.local(cachedEndDate.year, cachedEndDate.month, cachedEndDate.day + 1).setZone(constants_1.DATABASE_TIMEZONE);
            let currentDayCount = 1;
            let [upperBoundTime, lowerBoundTime] = [
                boundTimeObj.toUnixInteger(),
                boundTimeObj.minus({ day: currentDayCount++ }).toUnixInteger()
            ];
            let result = [[]];
            yield realtime.getContent(constants_2.COMPONENTS_PATH.sensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                yield ref.orderByChild("timeStamp").once('value', snapshot => {
                    if (!snapshot.exists()) {
                        constants_1.logger.warn("Snapshot does not exist with a value of " + snapshot.val());
                        return;
                    }
                    snapshot.forEach(child => {
                        const json = child.val();
                        const timestamp = json.timeStamp;
                        if (timestamp <= upperBoundTime) {
                            if (timestamp < lowerBoundTime) {
                                if (lowerBoundTime < dateRange.startDate)
                                    return;
                                [upperBoundTime, lowerBoundTime] = [
                                    lowerBoundTime,
                                    boundTimeObj.minus({ day: currentDayCount++ }).toUnixInteger()
                                ];
                                result.push([json]);
                                return;
                            }
                            result.at(-1).push(json);
                        }
                    });
                });
            }));
            constants_1.logger.debug(`SensorData by date: ${result}`);
            return !result.length ? option_1.None : (0, option_1.Some)(result.reverse());
        });
    }
    getLatestSensorData() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            const sensorNames = yield this.getSensors();
            if (sensorNames.match.isNone())
                return;
            for (const sensor of sensorNames.unwrapOr([])) {
                const data = yield this.getLatestSensorDataByName(sensor.name);
                if (data.match.isOk()) {
                    result.push(data.unwrapOr(null));
                }
            }
            constants_1.logger.debug(`Sensor data by Name: ${result}`);
            return result.length ? (0, option_1.Some)(result) : option_1.None;
        });
    }
    getLatestSensorDataByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = option_1.None;
            yield realtime.getContent(constants_2.COMPONENTS_PATH.sensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                const temp = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("sensorName").equalTo(name).limitToFirst(1));
                result = temp.map(arr => !arr[0] ? option_1.None : (0, option_1.Some)(arr[0]));
            }));
            constants_1.logger.debug(`Latest sensor data by name: ${result.unwrapOr(null)}`);
            return result;
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
                            const result = yield firestore.queryCollection(constants_2.COMPONENTS_PATH.sensor, collectionRef => collectionRef.where("name", "==", sensor.name).get());
                            if (!result.empty) {
                                constants_1.logger.error(`An sensor of the same name has already existed in the database: "${sensor.name}"`);
                                return Promise.reject(`400An sensor with the same name "${sensor.name}" has already existed in the database`);
                            }
                            yield firestore.addContentToCollection(constants_2.COMPONENTS_PATH.sensor, sensor);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_2.COMPONENTS_PATH.sensor, "name", {
                                equalToValue: sensor.name
                            });
                            if (result.match.isNone())
                                yield realtime.pushContent(sensor, constants_2.COMPONENTS_PATH.sensor);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 266"
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
                            const docs = (yield firestore.queryCollection(constants_2.COMPONENTS_PATH.sensor, collectionRef => collectionRef.where("name", "==", sensor.name).get())).docs;
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
                            yield realtime.getContent(constants_2.COMPONENTS_PATH.sensor, (ref) => __awaiter(this, void 0, void 0, function* () {
                                let isValid = false;
                                let key = "";
                                yield ref.orderByChild("name").equalTo(sensor.name).once("child_added", child => {
                                    if (isValid = child.exists())
                                        key = child.key;
                                });
                                if (isValid && key) {
                                    realtime.updateContent(sensor, `${constants_2.COMPONENTS_PATH.sensor}/${key}`);
                                    return;
                                }
                                Promise.reject(`404Could not find sensor named "${sensor.name}"`);
                            }));
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 275"
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
                            const result = yield firestore.queryCollection(constants_2.COMPONENTS_PATH.sensor, collectionRef => collectionRef.where("name", "==", sensorName).get());
                            if (result.empty)
                                return Promise.reject("404Specified sensor name does not match with anything in the database");
                            yield firestore.addContentToCollection(constants_2.COMPONENTS_PATH.sensorData, Object.assign({ sensorName }, sensorData));
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_2.COMPONENTS_PATH.sensor, "name", {
                                equalToValue: sensorName
                            });
                            if (result.match.isNone())
                                return Promise.reject(`404Could not find corresponding sensor name "${sensorName}"`);
                            yield realtime.pushContent(Object.assign({ sensorName }, sensorData), constants_2.COMPONENTS_PATH.sensorData);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 356"
            }, databaseAddEvent_1.default);
        });
    }
    addSensorDataByBundle(sensorData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: { numberOfSensorData: sensorData.length },
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            let error = 0;
                            for (const data of sensorData) {
                                const result = yield firestore.queryCollection(constants_2.COMPONENTS_PATH.sensor, collectionRef => collectionRef.where("name", "==", data.sensorName).get());
                                if (result.empty) {
                                    error++;
                                    continue;
                                }
                                yield firestore.addContentToCollection(constants_2.COMPONENTS_PATH.sensorData, data);
                            }
                            if (error > 0)
                                return Promise.reject({
                                    message: `There ${error > 1 ? "are" : "is"} ${error} sensor data for sensor names that are not registered in the database`,
                                    statusCode: 404,
                                    ignore: error !== sensorData.length,
                                    eventWhenIgnored: new databaseEvent_1.default({
                                        info: `${sensorData.length - error} sensor data is added to the database`,
                                        error: `${error} sensor data could not be added due to using sensor names that are not already in the database`,
                                        warning: "Some sensor data is added to the database but not all of them",
                                        type: "Ok"
                                    })
                                });
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            let error = 0;
                            for (const data of sensorData) {
                                let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_2.COMPONENTS_PATH.sensor, "name", {
                                    equalToValue: data.sensorName
                                });
                                if (result.match.isNone()) {
                                    error++;
                                    continue;
                                }
                                yield realtime.pushContent(data, constants_2.COMPONENTS_PATH.sensorData);
                            }
                            if (error > 0)
                                return Promise.reject({
                                    message: `There ${error > 1 ? "are" : "is"} ${error} sensor data for sensor names that are not registered in the database`,
                                    statusCode: 404,
                                    ignore: error !== sensorData.length,
                                    eventWhenIgnored: new databaseEvent_1.default({
                                        info: `${sensorData.length - error} sensor data is added to the database`,
                                        error: `${error} sensor data could not be added due to using sensor names that are not already in the database`,
                                        warning: "Some sensor data is added to the database but not all of them",
                                        type: "Ok"
                                    })
                                });
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 436"
            }, databaseAddEvent_1.default);
        });
    }
    deleteSensorData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: {},
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield firestore.deleteCollection(constants_2.COMPONENTS_PATH.sensorData);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield realtime.deleteContent(constants_2.COMPONENTS_PATH.sensorData);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 194"
            }, databaseDeleteEvent_1.default);
        });
    }
}
exports.default = SensorService;
//# sourceMappingURL=sensorService.js.map