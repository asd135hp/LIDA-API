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
exports.SecurityMethods = void 0;
const tsoa_1 = require("tsoa");
const serviceEntries_1 = require("../../v1/services/serviceEntries");
let SecurityMethods = class SecurityMethods extends tsoa_1.Controller {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield serviceEntries_1.persistentAuthService.reauthenticationWithEmail(email, password);
            return yield serviceEntries_1.persistentAuthService.loginWithEmail(email, password);
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("login"),
    __param(0, (0, tsoa_1.BodyProp)()),
    __param(1, (0, tsoa_1.BodyProp)())
], SecurityMethods.prototype, "login", null);
SecurityMethods = __decorate([
    (0, tsoa_1.Route)(`api/v1`),
    (0, tsoa_1.SuccessResponse)(200, "Ok"),
    (0, tsoa_1.Response)(403, "Forbidden"),
    (0, tsoa_1.Response)(404, "Not Found"),
    (0, tsoa_1.Response)(408, "Request Timeout")
], SecurityMethods);
exports.SecurityMethods = SecurityMethods;
//# sourceMappingURL=securityMethods.js.map