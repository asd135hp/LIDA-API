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
exports.Err = exports.Ok = void 0;
class Success {
    constructor(val) {
        this.val = val;
    }
    handleResult(ok, _) {
        ok && ok(this.val);
    }
    handleResultAsync(ok, _) {
        return __awaiter(this, void 0, void 0, function* () {
            ok && (yield ok(this.val));
        });
    }
}
class Failure {
    constructor(error) {
        this.err = error;
    }
    handleResult(_, error) {
        error && error(this.err);
    }
    handleResultAsync(_, error) {
        return __awaiter(this, void 0, void 0, function* () {
            error && (yield error(this.err));
        });
    }
}
function Ok(val) { return new Success(val); }
exports.Ok = Ok;
function Err(err) { return new Failure(err); }
exports.Err = Err;
//# sourceMappingURL=result.js.map