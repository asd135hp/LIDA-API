"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.SensorReadMethods = void 0;
const luxon_1 = require("luxon");
const tsoa_1 = require("tsoa");
const constants_1 = require("../../../../constants");
const sensorDto_1 = require("../../../../model/v1/read/sensorDto");
const dataSavingService_1 = __importDefault(require("../../services/firebaseFreetier/dataSavingService"));
const sensorService_1 = __importDefault(require("../../services/firebaseFreetier/sensorService"));
let SensorReadMethods = class SensorReadMethods extends tsoa_1.Controller {
    getSensors(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("SensorReadMethods: Getting all sensors from the database");
            const option = yield new sensorService_1.default().getSensors();
            return option.unwrapOr([]);
        });
    }
    getCategorizedSensors(accessToken, typeOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`SensorReadMethods: Getting categorized sensors from "${typeOrName}"`);
            const sensorService = new sensorService_1.default();
            const sensorsByType = yield sensorService.getSensorsByType(typeOrName);
            return yield sensorsByType.unwrapOrElseAsync(() => __awaiter(this, void 0, void 0, function* () {
                const sensorByName = yield sensorService.getSensorByName(typeOrName);
                return [sensorByName.unwrapOrElse(() => {
                        this.setStatus(404);
                        return null;
                    })].filter(x => x != null);
            }));
        });
    }
    getSensorData(accessToken, startDate = 0, endDate = luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger()) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`SensorReadMethods: Getting sensor data from the database from ${startDate} to ${endDate}`);
            const option = yield new sensorService_1.default().getSensorData({ startDate, endDate });
            return option.unwrapOrElse(() => {
                this.setStatus(404);
                return [];
            });
        });
    }
    getSensorDataByName(accessToken, name, startDate = 0, endDate = luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger()) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`SensorReadMethods: Getting sensor data from the database with sensor name of "${name}"`);
            const option = yield new sensorService_1.default().getSensorDataByName(name, { startDate, endDate });
            return option.unwrapOrElse(() => {
                this.setStatus(404);
                return [];
            });
        });
    }
    getLatestSensorData(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`SensorReadMethods: Getting all latest sensor data from the database`);
            const option = yield new sensorService_1.default().getLatestSensorData();
            return option.unwrapOrElse(() => {
                this.setStatus(404);
                return [];
            });
        });
    }
    getLatestSensorDataByName(accessToken, name) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`SensorReadMethods: Getting latest sensor data from the database with sensor name of "${name}"`);
            const option = yield new sensorService_1.default().getLatestSensorDataByName(name);
            return option.unwrapOrElse(() => {
                this.setStatus(404);
                return sensorDto_1.SensorDataDTO.fromJson({});
            });
        });
    }
    getSensorDataRunSnapshot(accessToken, runNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`SensorReadMethods: Getting sensor data of the previous run#${runNumber} from the database`);
            const option = yield new dataSavingService_1.default().retrieveSensorSnapshot(runNumber);
            return option.unwrapOrElse(() => {
                this.setStatus(404);
                return [];
            });
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("get"),
    __param(0, (0, tsoa_1.Query)())
], SensorReadMethods.prototype, "getSensors", null);
__decorate([
    (0, tsoa_1.Get)("{typeOrName}/get"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Path)())
], SensorReadMethods.prototype, "getCategorizedSensors", null);
__decorate([
    (0, tsoa_1.Get)("data/fetchAll"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)())
], SensorReadMethods.prototype, "getSensorData", null);
__decorate([
    (0, tsoa_1.Get)("{name}/data/get"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)())
], SensorReadMethods.prototype, "getSensorDataByName", null);
__decorate([
    (0, tsoa_1.Get)("data/latest/get"),
    __param(0, (0, tsoa_1.Query)())
], SensorReadMethods.prototype, "getLatestSensorData", null);
__decorate([
    (0, tsoa_1.Get)("{name}/data/latest/get"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Path)())
], SensorReadMethods.prototype, "getLatestSensorDataByName", null);
__decorate([
    (0, tsoa_1.Get)("snapshot/{runNumber}/get"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Path)())
], SensorReadMethods.prototype, "getSensorDataRunSnapshot", null);
SensorReadMethods = __decorate([
    (0, tsoa_1.Security)("api_key"),
    (0, tsoa_1.Route)(`api/v1/sensor`),
    (0, tsoa_1.SuccessResponse)(200, "Ok"),
    (0, tsoa_1.Response)(403, "Forbidden"),
    (0, tsoa_1.Response)(404, "Not Found"),
    (0, tsoa_1.Response)(408, "Request Timeout")
], SensorReadMethods);
exports.SensorReadMethods = SensorReadMethods;
//# sourceMappingURL=sensorReadMethods.js.map