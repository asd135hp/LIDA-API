"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const constants_1 = require("../../../constants");
class DatabaseEvent {
    constructor(report) {
        const now = luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE);
        this.content = Object.assign(Object.assign({}, report), { timeStamp: now.toUnixInteger(), isoTimeStamp: now.toISO(), normalTimeStamp: now.toLocaleString(luxon_1.DateTime.DATETIME_FULL_WITH_SECONDS) });
    }
    static getCompactEvent(event) {
        const values = event.content.values;
        delete values.protected;
        return new DatabaseEvent({
            type: event.content.type,
            info: event.content.info,
            error: event.content.error,
            warning: event.content.warning,
            values: values
        });
    }
}
exports.default = DatabaseEvent;
//# sourceMappingURL=databaseEvent.js.map