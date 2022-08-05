"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const databaseEvent_1 = __importDefault(require("./databaseEvent"));
class DatabaseWriteEvent extends databaseEvent_1.default {
    constructor(query, params, report) {
        super({
            type: "Ok",
            info: `Query: ${query}; Parameters: ${params}; Timestamp: ${Date.now()}`,
            error: "",
            additional: {
                queryMethod: report.additional.queryMethod,
                query,
                params
            }
        });
        this.query = query;
        this.params = params;
        constants_1.logger.info("A DatabaseWriteEvent is created!");
    }
}
exports.default = DatabaseWriteEvent;
//# sourceMappingURL=databaseWriteEvent.js.map