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
exports.retryTransaction = void 0;
function retry(callback, retryTimeout, retryCount, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (retryCount == 0)
            return Promise.reject("Retry limit reached!");
        return yield callback(...args).catch(() => {
            setTimeout(() => { }, retryTimeout);
            return retryTransaction(callback, retryTimeout, --retryCount, ...args);
        });
    });
}
exports.default = retry;
function retryTransaction(transaction, retryTimeout = 100, retryCount = 10, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield retry(transaction, retryTimeout, retryCount, ...args);
    });
}
exports.retryTransaction = retryTransaction;
//# sourceMappingURL=retry.js.map