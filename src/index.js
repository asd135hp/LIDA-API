"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("../build/routes");
const setup_1 = require("./controller/database/setup");
const view_1 = __importDefault(require("./view"));
const constants_1 = require("./constants");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)(constants_1.cookieSecret));
app.use('/', view_1.default);
(0, routes_1.RegisterRoutes)(app);
app.listen(port, () => {
    (0, setup_1.dropAllTables)();
    (0, setup_1.setupPostgreSQL)();
    console.log(`Express: Listening on port ${port}`);
});
//# sourceMappingURL=index.js.map