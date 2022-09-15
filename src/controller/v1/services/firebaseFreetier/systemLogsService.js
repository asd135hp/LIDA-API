"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../../constants");
const systemLogDto_1 = require("../../../../model/v1/read/systemLogDto");
const option_1 = require("../../../../model/patterns/option");
const constants_2 = require("../../../../constants");
const systemLogsService_1 = require("./utility/systemLogsService");
class SystemLogsService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    getSensorLogs(oldestTimestamp = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, systemLogsService_1.getLog)(oldestTimestamp, constants_2.COMPONENTS_PATH.logs.sensor);
            constants_1.logger.debug(`All logs: ${result}`);
            return result.length ? (0, option_1.Some)(result.map(json => systemLogDto_1.LogDTO.fromJson(json))) : option_1.None;
        });
    }
    getActuatorLogs(oldestTimestamp = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, systemLogsService_1.getLog)(oldestTimestamp, constants_2.COMPONENTS_PATH.logs.actuator);
            constants_1.logger.debug(`All logs: ${result}`);
            return result.length ? (0, option_1.Some)(result.map(json => systemLogDto_1.LogDTO.fromJson(json))) : option_1.None;
        });
    }
    getSystemCommandLogs(oldestTimestamp = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, systemLogsService_1.getLog)(oldestTimestamp, constants_2.COMPONENTS_PATH.logs.systemCommand);
            constants_1.logger.debug(`All logs: ${result}`);
            return result.length ? (0, option_1.Some)(result.map(json => systemLogDto_1.LogDTO.fromJson(json))) : option_1.None;
        });
    }
    addSensorLog(log) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, systemLogsService_1.pushLog)(constants_2.COMPONENTS_PATH.logs.sensor, log, this.publisher);
        });
    }
    addActuatorLog(log) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, systemLogsService_1.pushLog)(constants_2.COMPONENTS_PATH.logs.actuator, log, this.publisher);
        });
    }
    addSystemCommandLog(log) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, systemLogsService_1.pushLog)(constants_2.COMPONENTS_PATH.logs.systemCommand, log, this.publisher);
        });
    }
}
exports.default = SystemLogsService;
//# sourceMappingURL=systemLogsService.js.map