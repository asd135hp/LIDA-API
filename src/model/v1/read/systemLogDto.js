"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogDTO = void 0;
const luxon_1 = require("luxon");
const constants_1 = require("../../../constants");
class LogDTO {
    constructor(logContent, timeStamp) {
        this.timeStamp = timeStamp;
        this.logContent = logContent;
    }
    toJson() {
        return {
            timeStamp: this.timeStamp,
            logContent: this.logContent
        };
    }
    static fromJson(logJson) {
        const unixNow = luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger();
        return new LogDTO(typeof (logJson.logContent) === 'string' ? logJson.logContent : "", typeof (logJson.timeStamp) === 'number' ? logJson.timeStamp : unixNow);
    }
}
exports.LogDTO = LogDTO;
//# sourceMappingURL=systemLogDto.js.map