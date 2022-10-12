"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sensorWriteMethods_1 = require("./v1/methods/write/sensorWriteMethods");
const actuatorWriteMethods_1 = require("./v1/methods/write/actuatorWriteMethods");
const systemLogsWriteMethods_1 = require("./v1/methods/write/systemLogsWriteMethods");
const subscriptionImplementor_1 = require("../model/patterns/subscriptionImplementor");
const dataSavingWriteMethods_1 = require("./v1/methods/write/dataSavingWriteMethods");
const constants_1 = require("../constants");
const serviceEntries_1 = require("./v1/services/serviceEntries");
const systemCommandWriteMethods_1 = require("./v1/methods/write/systemCommandWriteMethods");
class CommandFacade extends subscriptionImplementor_1.PublisherImplementor {
    constructor() {
        super();
        sensorWriteMethods_1.SensorWriteMethods.mainService = new serviceEntries_1.SensorService(this);
        actuatorWriteMethods_1.ActuatorWriteMethods.mainService = new serviceEntries_1.ActuatorService(this);
        systemLogsWriteMethods_1.SystemLogsWriteMethods.mainService = new serviceEntries_1.SystemLogsService(this);
        dataSavingWriteMethods_1.DataSavingWriteMethods.mainService = new serviceEntries_1.DataSavingService(this);
        systemCommandWriteMethods_1.SystemCommandWriteMethods.mainService = new serviceEntries_1.SystemCommandService(this);
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