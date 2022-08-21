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
exports.realtimeSaveSensorSnapshot = exports.realtimeToggleFlag = exports.firestoreToggleFlag = void 0;
const constants_1 = require("../../../../../constants");
const dataSavingService_1 = __importDefault(require("../dataSavingService"));
const firebaseService_1 = require("../firebaseService");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
function firestoreToggleFlag(field) {
    return __awaiter(this, void 0, void 0, function* () {
        const val = {
            start: false,
            stop: false,
            restart: false,
            pause: false
        };
        val[field] = true;
        return yield firestore.runTransaction(constants_1.COMPONENTS_PATH.systemCommand, (snapshot, t) => __awaiter(this, void 0, void 0, function* () {
            t.set(snapshot.ref, val);
        }));
    });
}
exports.firestoreToggleFlag = firestoreToggleFlag;
function realtimeToggleFlag(field) {
    return __awaiter(this, void 0, void 0, function* () {
        const val = {
            start: false,
            stop: false,
            restart: false,
            pause: false
        };
        val[field] = true;
        return yield realtime.runTransaction(() => val, constants_1.COMPONENTS_PATH.systemCommand);
    });
}
exports.realtimeToggleFlag = realtimeToggleFlag;
function realtimeSaveSensorSnapshot(publisher) {
    return __awaiter(this, void 0, void 0, function* () {
        const ref = yield realtime.getContent(constants_1.COMPONENTS_PATH.count.run);
        const runCount = ref.exists() ? parseInt(ref.val()) : 0;
        const dataSaving = new dataSavingService_1.default(publisher);
        yield realtime.getContent(constants_1.COMPONENTS_PATH.sensor);
        yield realtime.updateContent(runCount + 1, constants_1.COMPONENTS_PATH.count.run);
    });
}
exports.realtimeSaveSensorSnapshot = realtimeSaveSensorSnapshot;
//# sourceMappingURL=systemCommandService.js.map