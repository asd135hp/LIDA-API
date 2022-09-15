"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const databaseEvent_1 = __importDefault(require("./databaseEvent"));
class DatabaseCreateEvent extends databaseEvent_1.default {
    constructor(values) {
        super({
            type: "Ok",
            info: "A create event has been created. Committing changes to the database",
            error: "",
            warning: "",
            values
        });
        constants_1.logger.info("A DatabaseCreateEvent is created!");
    }
}
exports.default = DatabaseCreateEvent;
//# sourceMappingURL=databaseCreateEvent.js.map