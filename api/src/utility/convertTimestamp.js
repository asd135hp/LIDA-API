"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTimeStampToSeconds = void 0;
const luxon_1 = require("luxon");
function convertTimeStampToSeconds(timeStamp) {
    const seconds = luxon_1.DateTime.now().toUnixInteger().toString();
    const timeStampStr = timeStamp.toString();
    if (seconds.length + 3 === timeStampStr.length)
        return Math.floor(timeStamp / 1000);
    if (seconds.length + 2 === timeStampStr.length)
        return Math.floor(timeStamp / 100);
    if (seconds.length + 1 === timeStampStr.length)
        return Math.floor(timeStamp / 10);
    return Math.floor(timeStamp);
}
exports.convertTimeStampToSeconds = convertTimeStampToSeconds;
//# sourceMappingURL=convertTimestamp.js.map