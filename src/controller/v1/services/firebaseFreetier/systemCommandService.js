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
const firebaseService_1 = require("./firebaseService");
const option_1 = require("../../../../model/patterns/option");
const databaseUpdateEvent_1 = __importDefault(require("../../../../model/v1/events/databaseUpdateEvent"));
const shorthandOps_1 = require("../../../../utility/shorthandOps");
const systemCommandDto_1 = require("../../../../model/v1/read/systemCommandDto");
const constants_1 = require("../../../../constants");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
const path = "systemCommand/flags";
function firestoreToggleFlag(field) {
    return __awaiter(this, void 0, void 0, function* () {
        const val = {
            start: false,
            stop: false,
            restart: false,
            pause: false
        };
        val[field] = true;
        return yield firestore.runTransaction(path, (snapshot, t) => __awaiter(this, void 0, void 0, function* () {
            t.set(snapshot.ref, val);
        }));
    });
}
function realtimeToggleFlag(field) {
    return __awaiter(this, void 0, void 0, function* () {
        const val = {
            start: false,
            stop: false,
            restart: false,
            pause: false
        };
        val[field] = true;
        return yield realtime.runTransaction(() => val, path);
    });
}
class SystemCommandService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    setStartSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            const field = "start";
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: { isStarted: true },
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield firestoreToggleFlag(field);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield realtimeToggleFlag(field);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 52"
            }, databaseUpdateEvent_1.default);
        });
    }
    setPauseSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            const field = "pause";
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: { isPaused: true },
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield firestoreToggleFlag(field);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield realtimeToggleFlag(field);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 69"
            }, databaseUpdateEvent_1.default);
        });
    }
    setStopSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            const field = "stop";
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: { isStopped: true },
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield firestoreToggleFlag(field);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield realtimeToggleFlag(field);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 86"
            }, databaseUpdateEvent_1.default);
        });
    }
    setRestartSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            const field = "restart";
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: { isRestarted: true },
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield firestoreToggleFlag(field);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield realtimeToggleFlag(field);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 104"
            }, databaseUpdateEvent_1.default);
        });
    }
    getSystemFlags() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield realtime.getContent(path);
            const flags = yield snapshot.val();
            try {
                return flags ? (0, option_1.Some)(systemCommandDto_1.SystemCommandDTO.fromJson(flags)) : option_1.None;
            }
            catch (e) {
                constants_1.logger.error("SystemCommandService - Caught an error while getting system flags: " + e);
                return option_1.None;
            }
        });
    }
}
exports.default = SystemCommandService;
//# sourceMappingURL=systemCommandService.js.map