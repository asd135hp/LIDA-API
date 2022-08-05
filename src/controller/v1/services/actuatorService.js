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
const actuatorDto_1 = require("../../../model/v1/read/actuatorDto");
const constants_1 = require("../../../constants");
const databaseAddEvent_1 = __importDefault(require("../../../model/v1/events/databaseAddEvent"));
const databaseUpdateEvent_1 = __importDefault(require("../../../model/v1/events/databaseUpdateEvent"));
const firebaseService_1 = require("./firebaseService");
const firebaseRealtimeService_1 = require("../../database/firebase/services/firebaseRealtimeService");
const firestore_1 = require("@google-cloud/firestore");
const filterDatabaseEvent_1 = require("../../../utility/filterDatabaseEvent");
const realtime = firebaseService_1.persistConnection.realtimeService;
const realtimeActuator = "query/actuators";
const realtimeActuatorCommand = "query/actuatorCommand";
const firestore = firebaseService_1.persistConnection.firestoreService;
const firestoreActuator = "actuators";
const firestoreActuatorCommand = "actuatorCommand";
class ActuatorService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    getActuators() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield realtime.getContent(realtimeActuator);
            constants_1.logger.debug(result);
            return result.val().map((json) => actuatorDto_1.ActuatorDTO.fromJson(json));
        });
    }
    getActuatorsByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield realtime.getContent(realtimeActuator, (ref) => __awaiter(this, void 0, void 0, function* () {
                result = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("type").equalTo(type));
            }));
            constants_1.logger.debug(result);
            return result.map((val) => actuatorDto_1.ActuatorDTO.fromJson(val));
        });
    }
    getActuatorByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield realtime.getContent(realtimeActuator, (ref) => __awaiter(this, void 0, void 0, function* () {
                result = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("name").equalTo(name));
            }));
            constants_1.logger.debug(result);
            return result.length > 0 ? actuatorDto_1.ActuatorDTO.fromJson(result[0]) : null;
        });
    }
    getActuatorCommands(limitToFirst) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield realtime.getContent(realtimeActuatorCommand, (ref) => __awaiter(this, void 0, void 0, function* () {
                const query = ref.orderByChild("timestamp");
                result = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(limitToFirst ? query.limitToFirst(limitToFirst) : query);
            }));
            constants_1.logger.debug(result);
            return result.map(json => actuatorDto_1.ActuatorCommandDTO.fromJson(json));
        });
    }
    getOldestActuatorCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getActuatorCommands(1);
            return result.length > 0 ? result.pop() : null;
        });
    }
    addActuator(actuator) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new databaseAddEvent_1.default(Object.assign(Object.assign({}, actuator), { protected: {
                    firestore(_) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield firestore.addContentToCollection(firestoreActuator, actuator);
                        });
                    },
                    realtime() {
                        Promise.all([realtime.pushContent(actuator, realtimeActuator)]);
                    }
                } }));
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
    updateActuator(actuator) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new databaseUpdateEvent_1.default(Object.assign(Object.assign({}, actuator), { protected: {
                    firestore(currentEvent) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const docs = (yield firestore.queryCollection(firestoreActuator, collectionRef => collectionRef.where("name", "==", actuator.name).get())).docs;
                            if (docs.length == 0)
                                return Promise.reject("404Specified name does not match with anything in the database");
                            if (docs.length > 1) {
                                currentEvent.content.warning = "Ambiguity: There are more than 2 actuators with the same name!";
                                return Promise.reject("400Could not update actuator details due to ambiguity");
                            }
                            yield firestore.updateDocument(docs[0].id, actuator);
                        });
                    },
                    realtime() {
                        Promise.all([
                            realtime.getContent(realtimeActuator, (ref) => __awaiter(this, void 0, void 0, function* () {
                                yield ref.orderByChild("name").equalTo(actuator.name).once("child_added", child => {
                                    realtime.updateContent(actuator, `${realtimeActuator}/${child.key}`);
                                });
                            }))
                        ]);
                    }
                } }));
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
    addActuatorCommand(name, actuatorCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new databaseAddEvent_1.default(Object.assign(Object.assign({ name }, actuatorCommand), { protected: {
                    firestore(_) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const result = yield firestore.queryCollection(firestoreActuator, collectionRef => collectionRef.where("name", "==", name).get());
                            if (result.docs.length == 0)
                                return Promise.reject("404Specified name does not match with anything in the database");
                            const currentIdDoc = `${firestoreActuatorCommand}/currentId`;
                            const currentId = parseInt((yield firestore.getDocument(currentIdDoc)).get("id"));
                            yield firestore.addContentToCollection(firestoreActuatorCommand, Object.assign(Object.assign({ id: firestore_1.FieldValue.increment(currentId), name }, actuatorCommand), { resolved: false }));
                            yield firestore.updateDocument(currentIdDoc, {
                                id: firestore_1.FieldValue.increment(currentId)
                            });
                        });
                    },
                    realtime() {
                        Promise.all([realtime.pushContent(Object.assign({ name }, actuatorCommand), realtimeActuatorCommand)]);
                    }
                } }));
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
    resolveActuatorCommand(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new databaseAddEvent_1.default({
                id,
                protected: {
                    firestore(_) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const result = yield firestore.queryCollection(firestoreActuatorCommand, collectionRef => collectionRef.where("id", "==", id).get());
                            if (result.docs.length == 0)
                                return Promise.reject(`404No actuator command is matched with id of ${id}`);
                            result.docs[0].ref.update({ resolved: true });
                        });
                    },
                    realtime() {
                        Promise.all([realtime.getContent(firestoreActuatorCommand, (ref) => __awaiter(this, void 0, void 0, function* () {
                                const arr = yield (0, firebaseRealtimeService_1.getQueryResult)(ref.orderByChild("id").equalTo(id));
                                for (const key in arr)
                                    yield realtime.deleteContent(`${firestoreActuatorCommand}/${key}`);
                            }))]);
                    }
                }
            });
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
}
exports.default = ActuatorService;
//# sourceMappingURL=actuatorService.js.map