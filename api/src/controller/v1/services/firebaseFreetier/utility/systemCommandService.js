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
exports.realtimeSaveSensorSnapshot = exports.realtimeToggleFlag = exports.firestoreToggleFlag = exports.realtimeUploadFlags = exports.firestoreUploadFlags = void 0;
const luxon_1 = require("luxon");
const constants_1 = require("../../../../../constants");
const databaseErrorEvent_1 = __importDefault(require("../../../../../model/v1/events/databaseErrorEvent"));
const helper_1 = require("../../../../../utility/helper");
const firebaseService_1 = require("../firebaseService");
const serviceEntries_1 = require("../../serviceEntries");
const dataSavingService_1 = require("./dataSavingService");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
function firestoreUploadFlags(flags, isProposed = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield firestore.runTransaction(constants_1.COMPONENTS_PATH.systemCommand, (snapshot, t) => __awaiter(this, void 0, void 0, function* () {
            t.set(snapshot.ref, flags);
        }));
    });
}
exports.firestoreUploadFlags = firestoreUploadFlags;
function realtimeUploadFlags(flags, isProposed = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield realtime.runTransaction(() => flags, constants_1.COMPONENTS_PATH.systemCommand);
    });
}
exports.realtimeUploadFlags = realtimeUploadFlags;
function firestoreToggleFlag(field) {
    return __awaiter(this, void 0, void 0, function* () {
        const flags = {
            start: false,
            stop: false,
            restart: false,
            pause: false
        };
        flags[field] = true;
        return yield firestoreUploadFlags(flags, true);
    });
}
exports.firestoreToggleFlag = firestoreToggleFlag;
function realtimeToggleFlag(field) {
    return __awaiter(this, void 0, void 0, function* () {
        const flags = {
            start: false,
            stop: false,
            restart: false,
            pause: false
        };
        flags[field] = true;
        return realtimeUploadFlags(flags, true);
    });
}
exports.realtimeToggleFlag = realtimeToggleFlag;
function realtimeSaveSensorSnapshot(publisher) {
    return __awaiter(this, void 0, void 0, function* () {
        const ref = yield realtime.getContent(constants_1.COMPONENTS_PATH.count.run);
        const runCount = ref.exists() ? parseInt(ref.val()) : 1;
        const folderName = `${constants_1.COMPONENTS_PATH.storage.sensor}/run${runCount}`;
        const sensorService = new serviceEntries_1.SensorService();
        const sensorEvent = yield (0, dataSavingService_1.uploadSnapshot)((yield sensorService.getSensors()).unwrapOr([]).sort((0, helper_1.orderByProp)("name")), { startDate: -1, endDate: -1 }, folderName, publisher, 65);
        if (sensorEvent instanceof databaseErrorEvent_1.default)
            Promise.reject("500Could not process upload data event. Please try again!");
        let currentTimestamp = luxon_1.DateTime.now().toUnixInteger();
        while (true) {
            const dateRange = {
                startDate: currentTimestamp - 3600 * 24,
                endDate: currentTimestamp
            };
            const oneDayData = (yield sensorService.getSensorData(dateRange)).unwrapOr([]);
            if (!oneDayData.length)
                break;
            let count = 0;
            while (count !== 3) {
                const event = yield (0, dataSavingService_1.uploadSnapshot)(oneDayData, dateRange, folderName, publisher, 82);
                if (event instanceof databaseErrorEvent_1.default) {
                    count++;
                    continue;
                }
            }
            if (count == 3)
                Promise.reject("500Could not process upload data event. Please try again!");
            currentTimestamp -= 3600 * 24;
        }
        yield realtime.updateContent(runCount + 1, constants_1.COMPONENTS_PATH.count.run);
    });
}
exports.realtimeSaveSensorSnapshot = realtimeSaveSensorSnapshot;
//# sourceMappingURL=systemCommandService.js.map