"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const databaseEvent_1 = __importDefault(require("./databaseEvent"));
class DatabaseUpdateEvent extends databaseEvent_1.default {
    constructor(values) {
        super({
            type: "Ok",
            info: "An update event has been created. Committing changes to the database...",
            error: "",
            warning: "",
            values
        });
        constants_1.logger.info("A DatabaseUpdateEvent is created!");
    }
}
exports.default = DatabaseUpdateEvent;
//# sourceMappingURL=databaseUpdateEvent.js.map