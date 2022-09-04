"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const serve_static_1 = __importDefault(require("serve-static"));
const express_session_1 = __importDefault(require("express-session"));
const routes_1 = require("./build/routes");
const view_1 = __importDefault(require("./src/view"));
const constants_1 = require("./src/constants");
const apiSetup_1 = __importDefault(require("./src/apiSetup"));
const serverErrorHandler_1 = __importDefault(require("./src/serverErrorHandler"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use((0, serve_static_1.default)(__dirname + "/public"));
app.use((0, express_session_1.default)({ secret: constants_1.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use((0, cookie_parser_1.default)(constants_1.COOKIE_SECRET));
app.use('/', view_1.default);
(0, routes_1.RegisterRoutes)(app);
app.use(serverErrorHandler_1.default);
const server = app.listen(port, () => {
    constants_1.logger.info("Start setting up API");
    (0, apiSetup_1.default)(server);
    constants_1.logger.info("Finished setting up API");
    constants_1.logger.info(`Express: Listening on port ${port}`);
});
server.on("connect", () => {
    constants_1.logger.info("A user logged in");
});
server.on("close", () => {
    constants_1.logger.info("Closing server...");
});
module.exports = app;
//# sourceMappingURL=index.js.map