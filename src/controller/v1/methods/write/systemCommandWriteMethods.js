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
var SystemCommandWriteMethods_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemCommandWriteMethods = void 0;
const tsoa_1 = require("tsoa");
let SystemCommandWriteMethods = SystemCommandWriteMethods_1 = class SystemCommandWriteMethods extends tsoa_1.Controller {
    constructor() {
        super();
        this.service = SystemCommandWriteMethods_1.mainService;
    }
    startSystem(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.setStartSystem();
        });
    }
    pauseSystem(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.setPauseSystem();
        });
    }
    stopSystem(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.setStopSystem();
        });
    }
    restartSystem(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.setRestartSystem();
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("startSystem"),
    __param(0, (0, tsoa_1.Query)())
], SystemCommandWriteMethods.prototype, "startSystem", null);
__decorate([
    (0, tsoa_1.Post)("pauseSystem"),
    __param(0, (0, tsoa_1.Query)())
], SystemCommandWriteMethods.prototype, "pauseSystem", null);
__decorate([
    (0, tsoa_1.Post)("stopSystem"),
    __param(0, (0, tsoa_1.Query)())
], SystemCommandWriteMethods.prototype, "stopSystem", null);
__decorate([
    (0, tsoa_1.Post)("restartSystem"),
    __param(0, (0, tsoa_1.Query)())
], SystemCommandWriteMethods.prototype, "restartSystem", null);
SystemCommandWriteMethods = SystemCommandWriteMethods_1 = __decorate([
    (0, tsoa_1.Security)("api_key"),
    (0, tsoa_1.Route)(`api/v1/systemCommand`),
    (0, tsoa_1.SuccessResponse)(200, "Ok"),
    (0, tsoa_1.Response)(403, "Forbidden"),
    (0, tsoa_1.Response)(404, "Not Found"),
    (0, tsoa_1.Response)(408, "Request Timeout")
], SystemCommandWriteMethods);
exports.SystemCommandWriteMethods = SystemCommandWriteMethods;
//# sourceMappingURL=systemCommandWriteMethods.js.map