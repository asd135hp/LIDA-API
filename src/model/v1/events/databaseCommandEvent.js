"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const time_1 = require("../../../utility/time");
const databaseEvent_1 = __importDefault(require("./databaseEvent"));
class DatabaseCommandEvent extends databaseEvent_1.default {
    constructor(query, params) {
        super({
            type: "Ok",
            info: `A command is sent to the database @${(0, time_1.getCurrentTimeString)()}`,
            error: "",
            additional: {
                queryMethod: query.split(' ')[0].toUpperCase()
            }
        });
        this.query = query;
        this.params = params;
        constants_1.logger.info("A DatabaseCommandEvent is created!");
    }
}
exports.default = DatabaseCommandEvent;
//# sourceMappingURL=databaseCommandEvent.js.map