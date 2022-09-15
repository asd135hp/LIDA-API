"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersectArrays = void 0;
function intersectArrays(...arrays) {
    let hashMap1 = new Set();
    let hashMap2 = new Set();
    arrays[0].map(val => hashMap1.add(val));
    arrays.map((arr, index) => {
        if (index == 0 || !hashMap1.size)
            return;
        arr.map(val => {
            if (hashMap1.has(val))
                hashMap2.add(val);
        });
        hashMap1 = hashMap2;
        hashMap2 = new Set();
    });
    return Array.from(hashMap1);
}
exports.intersectArrays = intersectArrays;
//# sourceMappingURL=intersection.js.map