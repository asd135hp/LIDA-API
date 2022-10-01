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
const systemCommandService_1 = require("./utility/systemCommandService");
const constants_2 = require("../../../../constants");
const systemCommandServiceFacade_1 = require("../../../../model/v1/services/systemCommandServiceFacade");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
class SystemCommandService extends systemCommandServiceFacade_1.SystemCommandServiceFacade {
    toggleFlag(flag) {
        return (0, shorthandOps_1.createWriteEvent)({
            data: { [flag]: true },
            protectedMethods: {
                write() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield (0, systemCommandService_1.firestoreToggleFlag)(flag);
                    });
                },
                read() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield (0, systemCommandService_1.realtimeToggleFlag)(flag);
                    });
                }
            },
            publisher: this.publisher,
            serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 52"
        }, databaseUpdateEvent_1.default);
    }
    setStartSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.toggleFlag("start");
        });
    }
    setPauseSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.toggleFlag("pause");
        });
    }
    setStopSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.toggleFlag("stop");
        });
    }
    setRestartSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.toggleFlag("restart");
        });
    }
    uploadHardwareSystemFlags(flags) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, shorthandOps_1.createWriteEvent)({
                data: { isRestarted: true },
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield (0, systemCommandService_1.firestoreUploadFlags)(flags);
                            if (flags.start)
                                yield firestore.deleteCollection("sensors");
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield (0, systemCommandService_1.realtimeUploadFlags)(flags);
                            if (flags.start)
                                yield (0, systemCommandService_1.realtimeSaveSensorSnapshot)(this.publisher);
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
            const snapshot = yield realtime.getContent(constants_2.COMPONENTS_PATH.systemCommand);
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
    getProposedSystemFlags() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield realtime.getContent(constants_2.COMPONENTS_PATH.systemCommandProposed);
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