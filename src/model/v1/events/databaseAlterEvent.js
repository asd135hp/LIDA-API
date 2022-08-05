"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const databaseEvent_1 = __importDefault(require("./databaseEvent"));
class DatabaseAlterEvent extends databaseEvent_1.default {
    constructor(info) {
        super({
            type: "Ok",
            info,
            error: ""
        });
        constants_1.logger.info("A DatabaseAlterEvent is created!");
    }
    modifyContent() {
    }
}
exports.default = DatabaseAlterEvent;
//# sourceMappingURL=databaseAlterEvent.js.map