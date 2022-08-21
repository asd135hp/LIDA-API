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
exports.getLog = exports.pushLog = void 0;
const luxon_1 = require("luxon");
const constants_1 = require("../../../../../constants");
const databaseAddEvent_1 = __importDefault(require("../../../../../model/v1/events/databaseAddEvent"));
const shorthandOps_1 = require("../../../../../utility/shorthandOps");
const firebaseRealtimeService_1 = require("../../../../database/firebase/services/firebaseRealtimeService");
const dataSavingService_1 = __importDefault(require("../dataSavingService"));
const firebaseService_1 = require("../firebaseService");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
const pushLog = (path, log, publisher) => __awaiter(void 0, void 0, void 0, function* () {
    log.timeStamp = log.timeStamp || luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger();
    return yield (0, shorthandOps_1.createWriteEvent)({
        data: log,
        protectedMethods: {
            write() {
                return __awaiter(this, void 0, void 0, function* () {
                    const collectionPath = path;
                    yield firestore.addContentToCollection(`${collectionPath}/content`, log);
                });
            },
            read() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield realtime.getContent(constants_1.COMPONENTS_PATH.count.logs, (ref) => __awaiter(this, void 0, void 0, function* () {
                        const count = (yield ref.transaction(val => {
                            if (typeof (val) !== 'number')
                                return 1;
                            if (val < constants_1.LOG_LINES)
                                return val + 1;
                            return val;
                        })).snapshot.val();
                        if (count >= constants_1.LOG_LINES)
                            realtime.getContent(path, (ref) => __awaiter(this, void 0, void 0, function* () {
                                const temp = yield (0, firebaseRealtimeService_1.getQueryResult)(ref.orderByChild("timeStamp").limitToFirst(1));
                                for (const key in temp)
                                    yield realtime.deleteContent(`${path}/${key}`);
                            }));
                        realtime.pushContent(log, path);
                    }));
                });
            }
        },
        publisher,
        serverLogErrorMsg: "SystemLogsService: DatabaseEvent filtration leads to all error ~ 63"
    }, databaseAddEvent_1.default);
});
exports.pushLog = pushLog;
const getLog = (oldestTimestamp, path) => __awaiter(void 0, void 0, void 0, function* () {
    const dataSavingService = new dataSavingService_1.default();
    let result = (yield dataSavingService.retrieveActuatorLogSnapshots({
        startDate: oldestTimestamp
    })).unwrapOr([]);
    yield realtime.getContent(path, (ref) => __awaiter(void 0, void 0, void 0, function* () {
        const temp = (yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(ref.orderByChild("timeStamp").limitToLast(constants_1.LOG_LINES), json => json.timeStamp >= oldestTimestamp)).unwrapOr([]);
        const len = temp.length;
        if (len < constants_1.LOG_LINES)
            result = result.slice(result.length - constants_1.LOG_LINES + len).concat(temp);
        else
            result = temp;
    }));
    return result;
});
exports.getLog = getLog;
//# sourceMappingURL=systemLogsService.js.map