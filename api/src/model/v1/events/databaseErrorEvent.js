"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const databaseEvent_1 = __importDefault(require("./databaseEvent"));
class DatabaseErrorEvent extends databaseEvent_1.default {
    constructor(reason, statusCode = 200) {
        super({
            type: "Error",
            info: "An error occurred!",
            error: reason,
            warning: "",
            values: {
                statusCode
            }
        });
        constants_1.logger.info("A DatabaseErrorEvent is created!");
    }
}
exports.default = DatabaseErrorEvent;
//# sourceMappingURL=databaseErrorEvent.js.map