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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const databaseCommandEvent_1 = __importDefault(require("../../model/events/databaseCommandEvent"));
const systemLogDto_1 = require("../../model/read/systemLogDto");
const client_1 = require("../database/client");
class LogsService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    getSensorLogs(sensor) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, client_1.clientWrapper)((client) => __awaiter(this, void 0, void 0, function* () {
                const result = yield client.query(`SELECT * FROM ${constants_1.schemaName}.logs WHERE sensorid=$1`, [sensor.id]);
                return result.rows.map(row => {
                    return systemLogDto_1.SensorLogDTO.fromJson(Object.assign(Object.assign({}, sensor.toJson()), row));
                });
            })) || [];
        });
    }
    getActuatorLogs(actuator) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, client_1.clientWrapper)((client) => __awaiter(this, void 0, void 0, function* () {
                const result = yield client.query(`SELECT * FROM ${constants_1.schemaName}.logs WHERE actuatorid=$1`, [actuator.id]);
                return result.rows.map(row => {
                    return systemLogDto_1.ActuatorLogDTO.fromJson(Object.assign(Object.assign({}, actuator.toJson()), row));
                });
            })) || [];
        });
    }
    addSensorLog(sensorName, log) {
        var _a;
        const logQuery = `
      UPDATE ${constants_1.schemaName}.logs
      SET logcontent = CONCAT(logcontent, $2)
      WHERE sensorname='$1'`.trim();
        const event = new databaseCommandEvent_1.default(logQuery, [sensorName, `[${log.timeStamp}] ${log.logContent}\r\n`]);
        (_a = this.publisher) === null || _a === void 0 ? void 0 : _a.notify(event);
        return event;
    }
    addActuatorLog(actuatorName, log) {
        var _a;
        const logQuery = `
      UPDATE ${constants_1.schemaName}.logs
      SET logcontent = CONCAT(logcontent, $2)
      WHERE actuatorname='$1'`.trim();
        const event = new databaseCommandEvent_1.default(logQuery, [actuatorName, `[${log.timeStamp}] ${log.logContent}\r\n`]);
        (_a = this.publisher) === null || _a === void 0 ? void 0 : _a.notify(event);
        return event;
    }
}
exports.default = LogsService;
//# sourceMappingURL=logsService.js.map