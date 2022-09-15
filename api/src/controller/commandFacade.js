"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sensorWriteMethods_1 = require("./v1/methods/write/sensorWriteMethods");
const actuatorWriteMethods_1 = require("./v1/methods/write/actuatorWriteMethods");
const systemLogsWriteMethods_1 = require("./v1/methods/write/systemLogsWriteMethods");
const subscriptionImplementor_1 = require("../model/patterns/subscriptionImplementor");
const dataSavingWriteMethods_1 = require("./v1/methods/write/dataSavingWriteMethods");
const constants_1 = require("../constants");
const sensorService_1 = __importDefault(require("./v1/services/firebaseFreetier/sensorService"));
const actuatorService_1 = __importDefault(require("./v1/services/firebaseFreetier/actuatorService"));
const systemLogsService_1 = __importDefault(require("./v1/services/firebaseFreetier/systemLogsService"));
const dataSavingService_1 = __importDefault(require("./v1/services/firebaseFreetier/dataSavingService"));
const systemCommandWriteMethods_1 = require("./v1/methods/write/systemCommandWriteMethods");
const systemCommandService_1 = __importDefault(require("./v1/services/firebaseFreetier/systemCommandService"));
class CommandFacade extends subscriptionImplementor_1.PublisherImplementor {
    constructor() {
        super();
        sensorWriteMethods_1.SensorWriteMethods.mainService = new sensorService_1.default(this);
        actuatorWriteMethods_1.ActuatorWriteMethods.mainService = new actuatorService_1.default(this);
        systemLogsWriteMethods_1.SystemLogsWriteMethods.mainService = new systemLogsService_1.default(this);
        dataSavingWriteMethods_1.DataSavingWriteMethods.mainService = new dataSavingService_1.default(this);
        systemCommandWriteMethods_1.SystemCommandWriteMethods.mainService = new systemCommandService_1.default(this);
        CommandFacade.sensor = new sensorWriteMethods_1.SensorWriteMethods();
        CommandFacade.actuator = new actuatorWriteMethods_1.ActuatorWriteMethods();
        CommandFacade.logs = new systemLogsWriteMethods_1.SystemLogsWriteMethods();
        CommandFacade.dataSaving = new dataSavingWriteMethods_1.DataSavingWriteMethods();
        CommandFacade.systemCommand = new systemCommandWriteMethods_1.SystemCommandWriteMethods();
        constants_1.logger.debug("CommandFacade is initialized. It is safe to make data transactions now!");
    }
}
exports.default = CommandFacade;
//# sourceMappingURL=commandFacade.js.map