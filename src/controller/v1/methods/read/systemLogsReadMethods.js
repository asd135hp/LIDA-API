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
exports.SystemLogsReadMethods = void 0;
const tsoa_1 = require("tsoa");
const constants_1 = require("../../../../constants");
const systemLogsService_1 = __importDefault(require("../../services/firebaseFreetier/systemLogsService"));
let SystemLogsReadMethods = class SystemLogsReadMethods extends tsoa_1.Controller {
    getSensorLogs(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("SystemLogsReadMethods: Getting sensor logs from the database");
            return (yield new systemLogsService_1.default().getSensorLogs()).unwrapOrElse(() => {
                this.setStatus(408);
                return [];
            });
        });
    }
    getActuatorLogs(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("SystemLogsReadMethods: Getting actuator logs from the database");
            return (yield new systemLogsService_1.default().getActuatorLogs()).unwrapOrElse(() => {
                this.setStatus(408);
                return [];
            });
        });
    }
    getSystemCommandLogs(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("SystemLogsReadMethods: Getting system command logs from the database");
            return (yield new systemLogsService_1.default().getSystemCommandLogs()).unwrapOrElse(() => {
                this.setStatus(408);
                return [];
            });
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("sensor/get"),
    __param(0, (0, tsoa_1.Query)())
], SystemLogsReadMethods.prototype, "getSensorLogs", null);
__decorate([
    (0, tsoa_1.Get)("actuator/get"),
    __param(0, (0, tsoa_1.Query)())
], SystemLogsReadMethods.prototype, "getActuatorLogs", null);
__decorate([
    (0, tsoa_1.Get)("systemCommand/get"),
    __param(0, (0, tsoa_1.Query)())
], SystemLogsReadMethods.prototype, "getSystemCommandLogs", null);
SystemLogsReadMethods = __decorate([
    (0, tsoa_1.Security)("api_key"),
    (0, tsoa_1.Route)(`api/v1/log`),
    (0, tsoa_1.SuccessResponse)(200, "Ok"),
    (0, tsoa_1.Response)("403", "Forbidden"),
    (0, tsoa_1.Response)("408", "Request Timeout")
], SystemLogsReadMethods);
exports.SystemLogsReadMethods = SystemLogsReadMethods;
//# sourceMappingURL=systemLogsReadMethods.js.map