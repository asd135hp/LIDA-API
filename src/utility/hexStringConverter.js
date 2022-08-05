"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hexStringConverter(buffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
exports.default = hexStringConverter;
//# sourceMappingURL=hexStringConverter.js.map