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
const actuatorDto_1 = require("../../../../model/v1/read/actuatorDto");
const constants_1 = require("../../../../constants");
const databaseAddEvent_1 = __importDefault(require("../../../../model/v1/events/databaseAddEvent"));
const databaseUpdateEvent_1 = __importDefault(require("../../../../model/v1/events/databaseUpdateEvent"));
const firebaseService_1 = require("./firebaseService");
const option_1 = require("../../../../model/patterns/option");
const shorthandOps_1 = require("../../../../utility/shorthandOps");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
const realtimeActuator = "actuators";
const realtimeActuatorConfig = "actuatorConfig";
const realtimeActuatorConfigProposed = "actuatorConfigProposed";
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
const firestoreActuator = "actuators";
const firestoreActuatorConfig = "actuatorConfig";
const firestoreActuatorConfigProposed = "actuatorConfigProposed";
class ActuatorService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    getActuators() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeActuator, null, { limitToFirst: constants_1.ACTUATOR_LIMIT });
            constants_1.logger.debug(`All actuators: ${result}`);
            return result.map(arr => {
                const newArr = arr.map(json => actuatorDto_1.ActuatorDTO.fromJson(json));
                return (0, option_1.Some)(newArr);
            });
        });
    }
    getActuatorsByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeActuator, "type", { equalToValue: type });
            constants_1.logger.debug(`Actuators by type: ${result}`);
            return result.map(arr => {
                const newArr = arr.map(json => actuatorDto_1.ActuatorDTO.fromJson(json));
                return (0, option_1.Some)(newArr);
            });
        });
    }
    getActuatorByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeActuator, "name", { equalToValue: name });
            constants_1.logger.debug(`Actuator by name: ${result}`);
            return result.map(arr => (0, option_1.Some)(actuatorDto_1.ActuatorDTO.fromJson(arr[0])));
        });
    }
    getActuatorConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeActuatorConfig);
            constants_1.logger.debug(`Actuator config(s): ${result}`);
            return result.map(arr => {
                const newArr = arr.map(json => actuatorDto_1.ActuatorConfigDTO.fromJson(json));
                return (0, option_1.Some)(newArr);
            });
        });
    }
    getProposedActuatorConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeActuatorConfigProposed);
            constants_1.logger.debug(`Proposed actuator config(s): ${result}`);
            return result.map(arr => {
                const newArr = arr.map(json => actuatorDto_1.ActuatorConfigDTO.fromJson(json));
                return (0, option_1.Some)(newArr);
            });
        });
    }
    addActuator(actuator) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (actuator.isRunning) === 'undefined')
                actuator.isRunning = true;
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: actuator,
                protectedMethods: {
                    write(_) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const result = yield firestore.queryCollection(firestoreActuator, collectionRef => collectionRef.where("name", "==", actuator.name).get());
                            if (!result.empty) {
                                constants_1.logger.error(`An actuator of the same name has already existed in the database: "${actuator.name}"`);
                                return Promise.reject(`400An actuator with the same name "${actuator.name}" has already existed in the database`);
                            }
                            yield firestore.addContentToCollection(firestoreActuator, actuator);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeActuator, "name", { equalToValue: actuator.name });
                            if (result.match.isNone())
                                yield realtime.pushContent(actuator, realtimeActuator);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 131"
            }, databaseAddEvent_1.default);
        });
    }
    updateActuator(actuator) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: actuator,
                protectedMethods: {
                    write(currentEvent) {
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
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield realtime.getContent(realtimeActuator, (ref) => __awaiter(this, void 0, void 0, function* () {
                                yield ref.orderByChild("name").equalTo(actuator.name).once("child_added", child => {
                                    realtime.updateContent(actuator, `${realtimeActuator}/${child.key}`);
                                });
                            }));
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 169"
            }, databaseUpdateEvent_1.default);
        });
    }
    updateActuatorConfig(actuatorName, actuatorConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateContent = Object.assign({ actuatorName }, actuatorConfig);
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: updateContent,
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const docPath = `${firestoreActuatorConfig}/${actuatorName}`;
                            const result = yield firestore.getDocument(docPath);
                            if (!result.exists) {
                                yield firestore.setDocument(docPath, updateContent);
                                return;
                            }
                            yield firestore.updateDocument(docPath, updateContent);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const path = `${realtimeActuatorConfig}/${actuatorName}`;
                            const content = yield realtime.getContent(path);
                            if (!content.exists()) {
                                yield realtime.setContent(updateContent, path);
                                return;
                            }
                            yield realtime.updateContent(updateContent, path);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 225"
            }, databaseUpdateEvent_1.default);
        });
    }
    updateProposedActuatorConfig(actuatorName, actuatorConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateContent = Object.assign({ actuatorName }, actuatorConfig);
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: updateContent,
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const docPath = `${firestoreActuatorConfigProposed}/${actuatorName}`;
                            const result = yield firestore.getDocument(docPath);
                            if (!result.exists) {
                                yield firestore.setDocument(docPath, updateContent);
                                return;
                            }
                            yield firestore.updateDocument(docPath, updateContent);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const path = `${realtimeActuatorConfigProposed}/${actuatorName}`;
                            const content = yield realtime.getContent(path);
                            if (!content.exists()) {
                                yield realtime.setContent(updateContent, path);
                                return;
                            }
                            yield realtime.updateContent(updateContent, path);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 272"
            }, databaseUpdateEvent_1.default);
        });
    }
}
exports.default = ActuatorService;
//# sourceMappingURL=actuatorService.js.map