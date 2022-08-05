"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTimeString = void 0;
const moment_1 = __importDefault(require("moment"));
function getCurrentTimeString() { return (0, moment_1.default)().format("YYYY-MM-DD HH:m:s"); }
exports.getCurrentTimeString = getCurrentTimeString;
//# sourceMappingURL=time.js.map