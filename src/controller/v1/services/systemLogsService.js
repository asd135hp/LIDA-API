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
const systemLogDto_1 = require("../../../model/v1/read/systemLogDto");
const databaseAddEvent_1 = __importDefault(require("../../../model/v1/events/databaseAddEvent"));
const firebaseService_1 = require("./firebaseService");
const firebaseRealtimeService_1 = require("../../database/firebase/services/firebaseRealtimeService");
const luxon_1 = require("luxon");
const firestore_1 = require("@google-cloud/firestore");
const filterDatabaseEvent_1 = require("../../../utility/filterDatabaseEvent");
const realtime = firebaseService_1.persistConnection.realtimeService;
const firestore = firebaseService_1.persistConnection.firestoreService;
class SystemLogsService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    getLogs(url, oldestTimestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield realtime.getContent(url, (ref) => __awaiter(this, void 0, void 0, function* () {
                result = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("timestamp")
                    .startAfter(oldestTimestamp)
                    .limitToLast(constants_1.LOG_LINES));
            }));
            constants_1.logger.debug(result);
            return result.map(json => systemLogDto_1.LogDTO.fromJson(json));
        });
    }
    pushLog(path, log) {
        return __awaiter(this, void 0, void 0, function* () {
            log.timeStamp = log.timeStamp || luxon_1.DateTime.now().setZone(constants_1.databaseTimezone).toUnixInteger();
            const event = new databaseAddEvent_1.default(Object.assign(Object.assign({}, log), { protected: {
                    firestore() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield firestore.updateDocument(path, {
                                content: firestore_1.FieldValue.arrayUnion(log)
                            });
                        });
                    },
                    realtime() {
                        Promise.all([
                            realtime.getContent(`${path}/logCount`, (ref) => __awaiter(this, void 0, void 0, function* () {
                                const count = (yield ref.transaction(val => {
                                    if (typeof (val) !== 'number')
                                        return 0;
                                    if (val < constants_1.LOG_LINES)
                                        return val + 1;
                                    return val;
                                })).snapshot.val();
                                if (count >= constants_1.LOG_LINES)
                                    realtime.getContent(path, (ref) => __awaiter(this, void 0, void 0, function* () {
                                        const temp = yield (0, firebaseRealtimeService_1.getQueryResult)(ref.orderByChild("timestamp").limitToFirst(1));
                                        for (const key in temp)
                                            yield realtime.deleteContent(`${path}/${key}`);
                                    }));
                                realtime.pushContent(log, path);
                            }))
                        ]);
                    }
                } }));
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.publisher.notifyAsync(event));
        });
    }
    getSensorLogs(oldestTimestamp = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getLogs("logs/sensor", oldestTimestamp);
        });
    }
    getActuatorLogs(oldestTimestamp = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getLogs("logs/actuator", oldestTimestamp);
        });
    }
    addSensorLog(log) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.pushLog("logs/sensor", log); });
    }
    addActuatorLog(log) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.pushLog("logs/actuator", log); });
    }
}
exports.default = SystemLogsService;
//# sourceMappingURL=systemLogsService.js.map