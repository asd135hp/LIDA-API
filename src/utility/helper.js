"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = exports.hexStringConverter = exports.getDateRangeString = exports.orderByProp = void 0;
const luxon_1 = require("luxon");
const constants_1 = require("../constants");
function orderByProp(prop, ascending = true) {
    return (s1, s2) => {
        if (s1[prop] == s2[prop])
            return 0;
        const result = s1[prop] > s2[prop] ? 1 : -1;
        return ascending ? result : -result;
    };
}
exports.orderByProp = orderByProp;
function getDateRangeString(dateRange) {
    return {
        start: luxon_1.DateTime.fromSeconds(dateRange.startDate || 0).setZone(constants_1.DATABASE_TIMEZONE).toISOTime(),
        end: (dateRange.endDate ? luxon_1.DateTime.fromSeconds(dateRange.endDate) : luxon_1.DateTime.now())
            .setZone(constants_1.DATABASE_TIMEZONE)
            .toISOTime()
    };
}
exports.getDateRangeString = getDateRangeString;
function hexStringConverter(buffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
exports.hexStringConverter = hexStringConverter;
const charList = (() => {
    let str = "";
    for (let i = 48; i <= 57; i++)
        str += String.fromCharCode(i);
    for (let i = 65; i <= 90; i++)
        str += String.fromCharCode(i);
    for (let i = 97; i <= 122; i++)
        str += String.fromCharCode(i);
    return str;
})();
function randomString(length, extendedCharList = "") {
    const newCharList = charList + extendedCharList;
    const len = charList.length;
    const randVals = Array.from(crypto.getRandomValues(new Uint8Array(length)));
    return randVals.map(num => newCharList[Math.round(num * (len - 1) / 255)]).join('');
}
exports.randomString = randomString;
//# sourceMappingURL=helper.js.map