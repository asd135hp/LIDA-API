"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSavingReadMethods = void 0;
const tsoa_1 = require("tsoa");
let DataSavingReadMethods = class DataSavingReadMethods extends tsoa_1.Controller {
};
DataSavingReadMethods = __decorate([
    (0, tsoa_1.Security)("api_key"),
    (0, tsoa_1.Route)(`api/v1/snapshot`),
    (0, tsoa_1.SuccessResponse)(200, "Ok"),
    (0, tsoa_1.Response)("403", "Forbidden"),
    (0, tsoa_1.Response)("408", "Request Timeout")
], DataSavingReadMethods);
exports.DataSavingReadMethods = DataSavingReadMethods;
//# sourceMappingURL=dataSavingReadMethods.js.map