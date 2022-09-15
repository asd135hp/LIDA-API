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
exports.None = exports.Some = void 0;
const constants_1 = require("../../constants");
class NormalOption {
    constructor(value) {
        this.match = {
            isOk() { return true; },
            isNone() { return false; }
        };
        this.value = value;
    }
    expect(_) { return this.value; }
    unwrapOr(_) { return this.value; }
    unwrapOrElse(_) { return this.value; }
    unwrapOrElseAsync(_) {
        return __awaiter(this, void 0, void 0, function* () { return this.value; });
    }
    map(callback) { return callback(this.value); }
    toString() { return `[object Some(${this.value.toString()})]`; }
}
class EmptyOption {
    constructor() {
        this.match = {
            isOk() { return false; },
            isNone() { return true; }
        };
    }
    expect(message, errorCtor) {
        constants_1.logger.error(`A None option was passed and expected. Error message: ${message}`);
        if (errorCtor)
            throw new errorCtor(message);
        throw new Error(message);
    }
    unwrapOr(defaultValue) { return defaultValue; }
    unwrapOrElse(callback) { return callback(); }
    unwrapOrElseAsync(asyncCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (asyncCallback)
                return yield asyncCallback();
            throw new TypeError("Unwrap callback must present");
        });
    }
    map(_) { return exports.None; }
    toString() { return "[object None]"; }
}
function Some(val) { return new NormalOption(val); }
exports.Some = Some;
exports.None = new EmptyOption();
//# sourceMappingURL=option.js.map