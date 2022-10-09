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
var ActuatorWriteMethods_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActuatorWriteMethods = void 0;
const tsoa_1 = require("tsoa");
const constants_1 = require("../../../../constants");
const databaseEvent_1 = __importDefault(require("../../../../model/v1/events/databaseEvent"));
const databaseErrorEvent_1 = __importDefault(require("../../../../model/v1/events/databaseErrorEvent"));
const getEvent = databaseEvent_1.default.getCompactEvent;
let ActuatorWriteMethods = ActuatorWriteMethods_1 = class ActuatorWriteMethods extends tsoa_1.Controller {
    constructor() {
        super();
        this.service = ActuatorWriteMethods_1.mainService;
    }
    addActuator(accessToken, actuator) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`ActuatorWriteMethods: Adding actuator "${actuator.name}" to the database`);
            const event = yield this.service.addActuator(actuator);
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            return getEvent(event);
        });
    }
    updateActuator(accessToken, actuator) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`ActuatorWriteMethods: Updating actuator "${actuator.name}" information in the database`);
            const event = yield this.service.updateActuator(actuator);
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            return getEvent(event);
        });
    }
    updateActuatorConfig(accessToken, actuatorName, actuatorConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`ActuatorWriteMethods: Updating config for actuator "${actuatorName}"`);
            const event = yield this.service.updateActuatorConfig(actuatorName, actuatorConfig);
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            return getEvent(event);
        });
    }
    updateProposedActuatorConfig(accessToken, actuatorName, actuatorConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`ActuatorWriteMethods: Updating config for actuator "${actuatorName}"`);
            const event = yield this.service.updateProposedActuatorConfig(actuatorName, actuatorConfig);
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            return getEvent(event);
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("add"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.BodyProp)())
], ActuatorWriteMethods.prototype, "addActuator", null);
__decorate([
    (0, tsoa_1.Patch)("update"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.BodyProp)())
], ActuatorWriteMethods.prototype, "updateActuator", null);
__decorate([
    (0, tsoa_1.Post)("{actuatorName}/config/update"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.BodyProp)())
], ActuatorWriteMethods.prototype, "updateActuatorConfig", null);
__decorate([
    (0, tsoa_1.Patch)("{actuatorName}/config/proposed/update"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.BodyProp)())
], ActuatorWriteMethods.prototype, "updateProposedActuatorConfig", null);
ActuatorWriteMethods = ActuatorWriteMethods_1 = __decorate([
    (0, tsoa_1.Security)(constants_1.defaultKeySchema),
    (0, tsoa_1.Route)(`api/v1/actuator`),
    (0, tsoa_1.SuccessResponse)(200, "Ok"),
    (0, tsoa_1.Response)(400, "Bad Request"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(403, "Forbidden"),
    (0, tsoa_1.Response)(404, "Not Found"),
    (0, tsoa_1.Response)(408, "Request Timeout")
], ActuatorWriteMethods);
exports.ActuatorWriteMethods = ActuatorWriteMethods;
//# sourceMappingURL=actuatorWriteMethods.js.map