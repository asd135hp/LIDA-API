"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const databaseErrorEvent_1 = __importDefault(require("../../../../model/v1/events/databaseErrorEvent"));
const databaseEvent_1 = __importDefault(require("../../../../model/v1/events/databaseEvent"));
function parseError(err) {
    if (!err)
        return new databaseErrorEvent_1.default("Could not retrieve data from the database, please try again later!", 408);
    if (typeof (err) === 'string')
        return new databaseErrorEvent_1.default(err.slice(3), Math.max(parseInt(err.slice(0, 3)), 400));
    if (typeof (err) === 'object') {
        try {
            const error = err;
            if (error.ignore)
                return error.eventWhenIgnored || new databaseEvent_1.default({
                    error: "",
                    info: "",
                    type: "Ok",
                    warning: "Error is ignored but no normal event is provided"
                });
            return new databaseErrorEvent_1.default(error.message, error.statusCode);
        }
        finally { }
    }
    return new databaseErrorEvent_1.default("Could not retrieve data from the database, please try again later!", 408);
}
exports.default = parseError;
//# sourceMappingURL=parseError.js.map