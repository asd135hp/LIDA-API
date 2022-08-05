"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const option_1 = require("../model/patterns/option");
const defaultCompareFcn = function fcn(a, b) { return a == b ? 0 : (a > b ? 1 : -1); };
function binarySearch(arr, target, opts) {
    const cmp = (opts === null || opts === void 0 ? void 0 : opts.compareFcn) || defaultCompareFcn;
    let [startIndex, endIndex, mid] = [
        (opts === null || opts === void 0 ? void 0 : opts.startIndex) || 0,
        (opts === null || opts === void 0 ? void 0 : opts.endIndex) || arr.length - 1,
        0
    ];
    while (endIndex > startIndex) {
        mid = startIndex + Math.floor((endIndex - startIndex) / 2);
        if (cmp(arr[mid], target) === 0)
            return (0, option_1.Some)({
                foundIndex: mid
            });
        if (cmp(arr[mid], target) < 0) {
            startIndex = mid + 1;
            continue;
        }
        endIndex = mid;
    }
    return option_1.None;
}
exports.default = binarySearch;
//# sourceMappingURL=binarySearch.js.map