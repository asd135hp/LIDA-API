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
const convertTimestamp_1 = require("../../../../../utility/convertTimestamp");
const shorthandOps_1 = require("../../../../../utility/firebase/shorthandOps");
const firebaseRealtimeService_1 = require("../../../../database/firebase/services/firebaseRealtimeService");
const serviceEntries_1 = require("../../serviceEntries");
const firebaseService_1 = require("../firebaseService");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
const pushLog = (path, log, publisher) => __awaiter(void 0, void 0, void 0, function* () {
    log.timeStamp = (0, convertTimestamp_1.convertTimeStampToSeconds)(log.timeStamp) || luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger();
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
                    const count = yield new serviceEntries_1.CounterService().incrementLogCounter(path);
                    if (count >= constants_1.LOG_LINES)
                        yield realtime.getContent(path, (ref) => __awaiter(this, void 0, void 0, function* () {
                            const temp = yield (0, firebaseRealtimeService_1.getQueryResult)(ref.orderByChild("timeStamp").limitToFirst(1));
                            for (const key in temp)
                                yield realtime.deleteContent(`${path}/${key}`);
                        }));
                    yield realtime.pushContent(log, path);
                });
            }
        },
        publisher,
        serverLogErrorMsg: "SystemLogsService: DatabaseEvent filtration leads to all error ~ 63"
    }, databaseAddEvent_1.default);
});
exports.pushLog = pushLog;
const getLog = (oldestTimestamp, path) => __awaiter(void 0, void 0, void 0, function* () {
    const dataSavingService = new serviceEntries_1.DataSavingService();
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