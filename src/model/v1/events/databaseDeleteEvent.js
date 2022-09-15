"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const databaseEvent_1 = __importDefault(require("./databaseEvent"));
class DatabaseDeleteEvent extends databaseEvent_1.default {
    constructor(values) {
        super({
            type: "Ok",
            info: "An delete event has been created. Committing changes to the database",
            error: "",
            warning: "",
            values
        });
        constants_1.logger.info("A DatabaseDeleteEvent is created!");
    }
}
exports.default = DatabaseDeleteEvent;
//# sourceMappingURL=databaseDeleteEvent.js.map