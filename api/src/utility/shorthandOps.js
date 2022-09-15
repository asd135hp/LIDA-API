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
exports.createWriteEvent = exports.getRealtimeContent = void 0;
const option_1 = require("../model/patterns/option");
const firebaseRealtimeService_1 = require("../controller/database/firebase/services/firebaseRealtimeService");
const firebaseService_1 = require("../controller/v1/services/firebaseFreetier/firebaseService");
const constants_1 = require("../constants");
const databaseErrorEvent_1 = __importDefault(require("../model/v1/events/databaseErrorEvent"));
const filterDatabaseEvent_1 = require("./filterDatabaseEvent");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
function getRealtimeContent(documentPath, field, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = option_1.None;
        yield realtime.getContent(documentPath, (ref) => __awaiter(this, void 0, void 0, function* () {
            let query = null;
            if (field)
                query = ref.orderByChild(field);
            if (options === null || options === void 0 ? void 0 : options.equalToValue)
                query = (query !== null && query !== void 0 ? query : ref).equalTo(options.equalToValue);
            if (typeof (options === null || options === void 0 ? void 0 : options.limitToFirst) === 'number')
                query = (query !== null && query !== void 0 ? query : ref).limitToFirst(options.limitToFirst);
            result = yield (0, firebaseRealtimeService_1.getQueryResultAsArray)(query !== null && query !== void 0 ? query : ref.limitToFirst(100));
        })).catch(() => { });
        return result;
    });
}
exports.getRealtimeContent = getRealtimeContent;
function createWriteEvent({ data, protectedMethods, publisher, serverLogErrorMsg }, DatabaseEventType) {
    return __awaiter(this, void 0, void 0, function* () {
        const event = new DatabaseEventType(Object.assign(Object.assign({}, data), { protected: protectedMethods }));
        return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield publisher.notifyAsync(event)).unwrapOrElse(() => {
            constants_1.logger.error(serverLogErrorMsg);
            return new databaseErrorEvent_1.default("The action is failed to be executed", 400);
        });
    });
}
exports.createWriteEvent = createWriteEvent;
//# sourceMappingURL=shorthandOps.js.map