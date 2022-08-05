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
const filterDatabaseEvent_1 = require("../../../../utility/filterDatabaseEvent");
const databaseErrorEvent_1 = __importDefault(require("../../../../model/v1/events/databaseErrorEvent"));
const shorthandOps_1 = require("../../../../utility/shorthandOps");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
const realtimeActuator = "actuators";
const realtimeActuatorCommand = "actuatorCommand";
const commandIdKey = "actuatorCommandId";
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
const firestoreActuator = "actuators";
const firestoreActuatorCommand = "actuatorCommand";
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
    getActuatorCommands(limitToFirst) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, shorthandOps_1.getRealtimeContent)(realtimeActuatorCommand, "timeStamp", { limitToFirst });
            constants_1.logger.debug(`${limitToFirst || ("All " + result.unwrapOr([]).length)} actuator command(s): ${result}`);
            return result.map(arr => {
                const newArr = arr.map(json => actuatorDto_1.ActuatorCommandDTO.fromJson(json));
                return (0, option_1.Some)(newArr);
            });
        });
    }
    getOldestActuatorCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getActuatorCommands(1);
            return result.map(arr => (0, option_1.Some)(arr.pop()));
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
    addActuatorCommand(actuatorName, actuatorCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            yield realtime.runTransaction(val => typeof (val) === 'number' ? val + 1 : 1, commandIdKey);
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: Object.assign({ actuatorName }, actuatorCommand),
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const result = yield firestore.queryCollection(firestoreActuator, collectionRef => collectionRef.where("name", "==", actuatorName).get());
                            if (result.empty)
                                return Promise.reject("404Specified name does not match with anything in the database");
                            yield firestore.addContentToCollection(firestoreActuatorCommand, Object.assign(Object.assign({ id: (yield realtime.getContent(commandIdKey)).val(), actuatorName }, actuatorCommand), { resolved: false }));
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const id = (yield realtime.getContent(commandIdKey)).val();
                            if (typeof (id) !== 'number') {
                                constants_1.logger.error("Could not get command id from firebase firestore storages");
                                return Promise.reject("500Server side error");
                            }
                            yield realtime.pushContent(Object.assign({ id, actuatorName }, actuatorCommand), realtimeActuatorCommand);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 190"
            }, databaseUpdateEvent_1.default);
        });
    }
    resolveActuatorCommand(id) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`Resolving an actuator command with id of ${id}`);
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: id,
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const result = yield firestore.queryCollection(firestoreActuatorCommand, collectionRef => collectionRef.where("id", "==", id).get());
                            if (result.empty)
                                return Promise.reject(`404No actuator command is matched with id of ${id}`);
                            yield firestore.runTransaction("", (_, t) => __awaiter(this, void 0, void 0, function* () {
                                t.update(result.docs[0].ref, { resolved: true });
                            }));
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield realtime.getContent(realtimeActuatorCommand, (ref) => __awaiter(this, void 0, void 0, function* () {
                                let isValid = false;
                                let key = "";
                                yield ref.orderByChild("id").equalTo(id).once('value', snapshot => {
                                    constants_1.logger.info("Actuator service - Resolve command: Snapshot:" + snapshot.val());
                                    if (isValid = snapshot.exists())
                                        snapshot.forEach(child => { key = child.key; });
                                });
                                if (isValid && key) {
                                    yield realtime.deleteContent(`${realtimeActuatorCommand}/${key}`);
                                    return;
                                }
                                Promise.reject("404Wrong command id or the command has already been resolved");
                            }));
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 190"
            }, databaseUpdateEvent_1.default);
            const event = new databaseUpdateEvent_1.default({
                id,
                protected: {
                    firestore(_) {
                        return __awaiter(this, void 0, void 0, function* () {
                        });
                    },
                    realtime() {
                        return __awaiter(this, void 0, void 0, function* () {
                        });
                    }
                }
            });
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event)).unwrapOrElse(() => {
                constants_1.logger.error("ActuatorService: DatabaseEvent filtration leads to all error ~ 299");
                return new databaseErrorEvent_1.default("The action is failed to be executed", 400);
            });
        });
    }
}
exports.default = ActuatorService;
//# sourceMappingURL=actuatorService.js.map