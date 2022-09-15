"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intersection_1 = require("../intersection");
it("should produce an intersected array", () => {
    const result = (0, intersection_1.intersectArrays)([1000, 234125, 215, 2, 52, 5, 25, 12, 5], [2, 5, 632, 5356, 46, 46, 436, 34, 643]);
    expect(result.length).toBe(2);
});
it("should not produce an intersected array", () => {
    const result = (0, intersection_1.intersectArrays)([1000, 234125, 215, 2, 52, 5, 25, 12, 5], [8, 76, 632, 5356, 46, 46, 436, 34, 643]);
    expect(result.length).toBe(0);
});
//# sourceMappingURL=intersection.test.js.map