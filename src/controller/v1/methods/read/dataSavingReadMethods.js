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
exports.DataSavingReadMethods = void 0;
const tsoa_1 = require("tsoa");
const constants_1 = require("../../../../constants");
const helper_1 = require("../../../../utility/helper");
const dataSavingService_1 = __importDefault(require("../../services/firebaseFreetier/dataSavingService"));
let DataSavingReadMethods = class DataSavingReadMethods extends tsoa_1.Controller {
    retrieveSensorSnapshots(accessToken, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = (0, helper_1.getDateRangeString)({ startDate, endDate });
            constants_1.logger.info(`DataSavingReadMethods: Getting all sensor snapshots in range from ${t.start} to ${t.end}`);
            const option = yield new dataSavingService_1.default().retrieveSensorSnapshots({ startDate, endDate });
            return option.unwrapOr([]);
        });
    }
    retrieveLogSnapshots(accessToken, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = (0, helper_1.getDateRangeString)({ startDate, endDate });
            constants_1.logger.info(`DataSavingReadMethods: Getting all log snapshots in range from ${t.start} to ${t.end}`);
            const option = yield new dataSavingService_1.default().retrieveLogSnapshots({ startDate, endDate });
            return option.unwrapOr([]);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("sensor/get"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)())
], DataSavingReadMethods.prototype, "retrieveSensorSnapshots", null);
__decorate([
    (0, tsoa_1.Get)("logs/get"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)())
], DataSavingReadMethods.prototype, "retrieveLogSnapshots", null);
DataSavingReadMethods = __decorate([
    (0, tsoa_1.Security)("api_key"),
    (0, tsoa_1.Route)(`api/v1/snapshot`),
    (0, tsoa_1.SuccessResponse)(200, "Ok"),
    (0, tsoa_1.Response)("403", "Forbidden"),
    (0, tsoa_1.Response)("408", "Request Timeout")
], DataSavingReadMethods);
exports.DataSavingReadMethods = DataSavingReadMethods;
//# sourceMappingURL=dataSavingReadMethods.js.map