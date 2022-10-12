"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistentAuthService = exports.SystemLogsService = exports.SystemCommandService = exports.DataSavingService = exports.CounterService = exports.SensorService = exports.ActuatorService = void 0;
const actuatorService_1 = __importDefault(require("./firebaseFreetier/actuatorService"));
const counterService_1 = __importDefault(require("./firebaseFreetier/counterService"));
const dataSavingService_1 = __importDefault(require("./firebaseFreetier/dataSavingService"));
const firebaseService_1 = require("./firebaseFreetier/firebaseService");
const sensorService_1 = __importDefault(require("./firebaseFreetier/sensorService"));
const systemCommandService_1 = __importDefault(require("./firebaseFreetier/systemCommandService"));
const systemLogsService_1 = __importDefault(require("./firebaseFreetier/systemLogsService"));
class ActuatorService extends actuatorService_1.default {
}
exports.ActuatorService = ActuatorService;
class SensorService extends sensorService_1.default {
}
exports.SensorService = SensorService;
class CounterService extends counterService_1.default {
}
exports.CounterService = CounterService;
class DataSavingService extends dataSavingService_1.default {
}
exports.DataSavingService = DataSavingService;
class SystemCommandService extends systemCommandService_1.default {
}
exports.SystemCommandService = SystemCommandService;
class SystemLogsService extends systemLogsService_1.default {
}
exports.SystemLogsService = SystemLogsService;
exports.persistentAuthService = firebaseService_1.persistentFirebaseConnection.authService;
//# sourceMappingURL=serviceEntries.js.map