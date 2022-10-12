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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActuatorReadMethods = void 0;
const tsoa_1 = require("tsoa");
const constants_1 = require("../../../../constants");
const serviceEntries_1 = require("../../services/serviceEntries");
let ActuatorReadMethods = class ActuatorReadMethods extends tsoa_1.Controller {
    getActuators(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("ActuatorReadMethods: Getting all actuators from the database");
            const option = yield new serviceEntries_1.ActuatorService().getActuators();
            return option.unwrapOrElse(() => {
                this.setStatus(408);
                return [];
            });
        });
    }
    getCategorizedActuators(accessToken, typeOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`ActuatorReadMethods: Getting categorized actuators from the database "${typeOrName}"`);
            const actuatorService = new serviceEntries_1.ActuatorService();
            const actuatorsByType = yield actuatorService.getActuatorsByType(typeOrName);
            return yield actuatorsByType.unwrapOrElseAsync(() => __awaiter(this, void 0, void 0, function* () {
                const actuatorByName = yield actuatorService.getActuatorByName(typeOrName);
                return [actuatorByName.unwrapOrElse(() => {
                        this.setStatus(404);
                        return null;
                    })].filter(x => x != null);
            }));
        });
    }
    getActuatorConfigs(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("ActuatorReadMethods: Getting actuator configs from the database");
            const option = yield new serviceEntries_1.ActuatorService().getActuatorConfig();
            return option.unwrapOrElse(() => {
                this.setStatus(408);
                return [];
            });
        });
    }
    getProposedActuatorConfigs(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("ActuatorReadMethods: Getting proposed actuator configs from the database");
            const option = yield new serviceEntries_1.ActuatorService().getProposedActuatorConfig();
            return option.unwrapOrElse(() => {
                this.setStatus(408);
                return [];
            });
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("get"),
    __param(0, (0, tsoa_1.Query)())
], ActuatorReadMethods.prototype, "getActuators", null);
__decorate([
    (0, tsoa_1.Get)("{typeOrName}/get"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Path)())
], ActuatorReadMethods.prototype, "getCategorizedActuators", null);
__decorate([
    (0, tsoa_1.Get)("config/get"),
    __param(0, (0, tsoa_1.Query)())
], ActuatorReadMethods.prototype, "getActuatorConfigs", null);
__decorate([
    (0, tsoa_1.Get)("config/proposed/get"),
    __param(0, (0, tsoa_1.Query)())
], ActuatorReadMethods.prototype, "getProposedActuatorConfigs", null);
ActuatorReadMethods = __decorate([
    (0, tsoa_1.Security)(constants_1.defaultKeySchema),
    (0, tsoa_1.Route)(`api/v1/actuator`),
    (0, tsoa_1.SuccessResponse)(200, "Ok"),
    (0, tsoa_1.Response)(403, "Forbidden"),
    (0, tsoa_1.Response)(404, "Not Found"),
    (0, tsoa_1.Response)(408, "Request Timeout")
], ActuatorReadMethods);
exports.ActuatorReadMethods = ActuatorReadMethods;
//# sourceMappingURL=actuatorReadMethods.js.map