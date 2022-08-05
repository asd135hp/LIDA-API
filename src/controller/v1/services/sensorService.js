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
const constants_1 = require("../../../constants");
const sensorDto_1 = require("../../../model/v1/read/sensorDto");
const databaseAddEvent_1 = __importDefault(require("../../../model/v1/events/databaseAddEvent"));
const databaseUpdateEvent_1 = __importDefault(require("../../../model/v1/events/databaseUpdateEvent"));
const firebaseService_1 = require("./firebaseService");
const firebaseRealtimeService_1 = require("../../database/firebase/services/firebaseRealtimeService");
const luxon_1 = require("luxon");
const filterDatabaseEvent_1 = require("../../../utility/filterDatabaseEvent");
const realtime = firebaseService_1.persistConnection.realtimeService;
const realtimeSensor = "query/sensors";
const realtimeSensorData = "query/sensorData";
const firestore = firebaseService_1.persistConnection.firestoreService;
const firestoreSensor = "sensors";
const firestoreSensorData = "sensorData";
class SensorService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    getSensors() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield realtime.getContent(realtimeSensor);
            constants_1.logger.debug(result);
            return result.val().map((json) => sensorDto_1.SensorDTO.fromJson(json));
        });
    }
    getSensorsByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield realtime.getContent(realtimeSensor, (ref) => __awaiter(this, void 0, void 0, function* () {
                result = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("type").equalTo(type));
            }));
            constants_1.logger.debug(result);
            return result.map((val) => sensorDto_1.SensorDTO.fromJson(val));
        });
    }
    getSensorByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield realtime.getContent(realtimeSensor, (ref) => __awaiter(this, void 0, void 0, function* () {
                result = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("name").equalTo(name));
            }));
            constants_1.logger.debug(result);
            return result.length > 0 ? sensorDto_1.SensorDTO.fromJson(result[0]) : null;
        });
    }
    getSensorDataByName(name, dateRange = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            dateRange.startDate = dateRange.startDate || 0;
            dateRange.endDate = dateRange.endDate || luxon_1.DateTime.now().setZone(constants_1.databaseTimezone).toUnixInteger();
            let result;
            yield realtime.getContent(realtimeSensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                result = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("name").equalTo(name), json => {
                    const timestamp = json.timestamp;
                    return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate;
                });
            }));
            constants_1.logger.debug(result);
            return result.map(val => sensorDto_1.SensorDataDTO.fromJson(val));
        });
    }
    addSensor(sensor) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new databaseAddEvent_1.default(Object.assign(Object.assign({}, sensor), { protected: {
                    firestore(_) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield firestore.addContentToCollection(firestoreSensor, sensor);
                        });
                    },
                    realtime() {
                        Promise.all([realtime.pushContent(sensor, realtimeSensor)]);
                    }
                } }));
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
    updateSensor(sensor) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new databaseUpdateEvent_1.default(Object.assign(Object.assign({}, sensor), { protected: {
                    firestore(currentEvent) {
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
                    realtime() {
                        Promise.all([
                            realtime.getContent(realtimeSensor, (ref) => __awaiter(this, void 0, void 0, function* () {
                                yield ref.orderByChild("name").equalTo(sensor.name).once("child_added", child => {
                                    realtime.updateContent(sensor, `${realtimeSensor}/${child.key}`);
                                });
                            }))
                        ]);
                    }
                } }));
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
    addSensorData(name, sensorData) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new databaseAddEvent_1.default(Object.assign(Object.assign({ name }, sensorData), { protected: {
                    firestore(_) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const result = yield firestore.queryCollection(firestoreSensor, collectionRef => collectionRef.where("name", "==", name).get());
                            if (result.docs.length == 0)
                                return Promise.reject("404Specified name does not match with anything in the database");
                            yield firestore.addContentToCollection(firestoreSensorData, Object.assign({ name }, sensorData));
                        });
                    },
                    realtime() {
                        Promise.all([realtime.pushContent(Object.assign({ name }, sensorData), realtimeSensorData)]);
                    }
                } }));
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
}
exports.default = SensorService;
//# sourceMappingURL=sensorService.js.map