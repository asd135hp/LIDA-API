"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDatabaseEvent = void 0;
const databaseErrorEvent_1 = __importDefault(require("../model/v1/events/databaseErrorEvent"));
const option_1 = require("../model/patterns/option");
function filterDatabaseEvent(events, filterType) {
    const arr = events.filter(ev => filterType && typeof (filterType) == 'object' && !(ev instanceof filterType));
    if (arr.length == 0) {
        const withoutErrArr = events.filter(ev => !(ev instanceof databaseErrorEvent_1.default));
        return withoutErrArr.length >= 1 ? (0, option_1.Some)(withoutErrArr[0]) : option_1.None;
    }
    return arr.length >= 1 ? (0, option_1.Some)(arr[0]) : option_1.None;
}
exports.filterDatabaseEvent = filterDatabaseEvent;
//# sourceMappingURL=filterDatabaseEvent.js.map