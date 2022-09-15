"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = __importDefault(require("./login"));
const user_1 = __importDefault(require("./user"));
const router = (0, express_1.Router)();
router.use("/user", user_1.default);
router.use("/login", login_1.default);
const index = router.get("/", (req, res) => {
    res.send("Hello world");
});
exports.default = index;
//# sourceMappingURL=index.js.map