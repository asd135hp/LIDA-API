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
exports.SystemCommandReadMethods = void 0;
const tsoa_1 = require("tsoa");
const constants_1 = require("../../../../constants");
const systemCommandService_1 = __importDefault(require("../../services/firebaseFreetier/systemCommandService"));
let SystemCommandReadMethods = class SystemCommandReadMethods extends tsoa_1.Controller {
    getSystemCommands(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("SystemCommandReadMethods: Getting system commands from the database");
            const option = yield new systemCommandService_1.default().getSystemFlags();
            return option.unwrapOrElse(() => {
                constants_1.logger.error("SystemCommandReadMethods - Something happened to either the code or the database");
                throw new Error("Internal error");
            });
        });
    }
    getProposedSystemCommands(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("SystemCommandReadMethods: Getting proposed system commands from the database");
            const option = yield new systemCommandService_1.default().getProposedSystemFlags();
            return option.unwrapOrElse(() => {
                constants_1.logger.error("SystemCommandReadMethods - Something happened to either the code or the database");
                throw new Error("Internal error");
            });
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("get"),
    __param(0, (0, tsoa_1.Query)())
], SystemCommandReadMethods.prototype, "getSystemCommands", null);
__decorate([
    (0, tsoa_1.Get)("proposed/get"),
    __param(0, (0, tsoa_1.Query)())
], SystemCommandReadMethods.prototype, "getProposedSystemCommands", null);
SystemCommandReadMethods = __decorate([
    (0, tsoa_1.Security)("api_key"),
    (0, tsoa_1.Route)(`api/v1/systemCommand`),
    (0, tsoa_1.SuccessResponse)(200, "Ok"),
    (0, tsoa_1.Response)(403, "Forbidden"),
    (0, tsoa_1.Response)(404, "Not Found"),
    (0, tsoa_1.Response)(408, "Request Timeout")
], SystemCommandReadMethods);
exports.SystemCommandReadMethods = SystemCommandReadMethods;
//# sourceMappingURL=systemCommandReadMethods.js.map