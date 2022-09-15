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
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseService_1 = require("./firebaseService");
const constants_1 = require("../../../../constants");
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
class CounterService {
    constructor() { }
    incrementLogCounter(whichCounter, by = 1, maxCounter = constants_1.LOG_LINES) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = -1;
            yield realtime.getContent(`${constants_1.COMPONENTS_PATH.count.path}/${whichCounter}`, (ref) => __awaiter(this, void 0, void 0, function* () {
                count = (yield ref.transaction(val => {
                    if (typeof (val) !== 'number')
                        return 1;
                    if (val < maxCounter)
                        return val + by;
                    return val;
                })).snapshot.val();
            }));
            return count;
        });
    }
    resetLogCounter(whichCounter, to = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = -1;
            yield realtime.getContent(`${constants_1.COMPONENTS_PATH.count.path}/${whichCounter}`, (ref) => __awaiter(this, void 0, void 0, function* () {
                count = (yield ref.transaction(_ => to)).snapshot.val();
            }));
            return count;
        });
    }
    incrementSystemRunCounter() {
        return __awaiter(this, void 0, void 0, function* () {
            let count = -1;
            yield realtime.getContent(`${constants_1.COMPONENTS_PATH.count.run}`, (ref) => __awaiter(this, void 0, void 0, function* () {
                const transaction = yield ref.transaction(val => typeof (val) !== 'number' ? 1 : val + 1);
                count = transaction.snapshot.val();
            }));
            return count;
        });
    }
}
exports.default = CounterService;
//# sourceMappingURL=counterService.js.map