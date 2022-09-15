"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actuatorReadMethods_1 = require("./v1/methods/read/actuatorReadMethods");
const systemLogsReadMethods_1 = require("./v1/methods/read/systemLogsReadMethods");
const sensorReadMethods_1 = require("./v1/methods/read/sensorReadMethods");
const dataSavingReadMethods_1 = require("./v1/methods/read/dataSavingReadMethods");
const securityMethods_1 = require("./security/methods/securityMethods");
const systemCommandReadMethods_1 = require("./v1/methods/read/systemCommandReadMethods");
class QueryFacade {
}
exports.default = QueryFacade;
QueryFacade.sensor = new sensorReadMethods_1.SensorReadMethods();
QueryFacade.actuator = new actuatorReadMethods_1.ActuatorReadMethods();
QueryFacade.logs = new systemLogsReadMethods_1.SystemLogsReadMethods();
QueryFacade.dataSaving = new dataSavingReadMethods_1.DataSavingReadMethods();
QueryFacade.systemCommand = new systemCommandReadMethods_1.SystemCommandReadMethods();
QueryFacade.security = new securityMethods_1.SecurityMethods();
//# sourceMappingURL=queryFacade.js.map