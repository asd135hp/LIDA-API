"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const commandBus_1 = __importDefault(require("./controller/v1/model/bus/commandBus"));
const writeModel_1 = __importDefault(require("./controller/v1/model/writeModel"));
const commandFacade_1 = __importDefault(require("./controller/commandFacade"));
const eventBus_1 = __importDefault(require("./controller/v1/model/bus/eventBus"));
const eventProcessor_1 = __importDefault(require("./controller/v1/model/eventProcessor"));
const dataSavingModel_1 = __importDefault(require("./controller/v1/model/dataSavingModel"));
function apiSetup(server) {
    const start = new commandFacade_1.default();
    const commandBus = new commandBus_1.default(start);
    const writeModel = new writeModel_1.default(commandBus);
    const dataSavingModel = new dataSavingModel_1.default(commandBus);
    const eventBus = new eventBus_1.default(writeModel);
    const processEvent = new eventProcessor_1.default(eventBus);
    const closePubSub = () => {
        start.end();
        commandBus.end();
        writeModel.end();
        dataSavingModel.end();
        eventBus.end();
        processEvent.onFinished();
    };
    const termination = () => {
        constants_1.logger.info("The process ended with either a SIGINT or SIGTERM");
        closePubSub();
        server === null || server === void 0 ? void 0 : server.close();
        process.exit(0);
    };
    process.on("SIGINT", termination);
    process.on("SIGTERM", termination);
    return closePubSub;
}
exports.default = apiSetup;
//# sourceMappingURL=apiSetup.js.map