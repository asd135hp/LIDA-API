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
var DataSavingWriteMethods_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSavingWriteMethods = void 0;
const tsoa_1 = require("tsoa");
const constants_1 = require("../../../../constants");
const databaseEvent_1 = __importDefault(require("../../../../model/v1/events/databaseEvent"));
const databaseErrorEvent_1 = __importDefault(require("../../../../model/v1/events/databaseErrorEvent"));
const firebaseService_1 = require("../../services/firebaseFreetier/firebaseService");
const sensorService_1 = __importDefault(require("../../services/firebaseFreetier/sensorService"));
const getEvent = databaseEvent_1.default.getCompactEvent;
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
let DataSavingWriteMethods = DataSavingWriteMethods_1 = class DataSavingWriteMethods extends tsoa_1.Controller {
    constructor() {
        super();
        this.service = DataSavingWriteMethods_1.mainService;
    }
    deleteSensorSnapshot(accessToken, runNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.service.deleteSensorSnapshot(runNumber);
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            return getEvent(event);
        });
    }
    saveSensorSnapshot(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info(`DataSavingWriteMethods: Saving sensor snapshot to the storage`);
            const sensorService = new sensorService_1.default();
            const snapshot = yield sensorService.getSensorDataSnapshot();
            let event = yield this.service.uploadSensorSnapshot({
                sensor: (yield sensorService.getSensors()).unwrapOr([]),
                data: snapshot.unwrapOr([])
            }, 1);
            if (process.env.NODE_ENV === 'production') {
            }
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            return getEvent(event);
        });
    }
};
__decorate([
    (0, tsoa_1.Patch)("sensor/{runNumber}/delete"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Path)())
], DataSavingWriteMethods.prototype, "deleteSensorSnapshot", null);
__decorate([
    (0, tsoa_1.Post)("sensor/save"),
    __param(0, (0, tsoa_1.Query)())
], DataSavingWriteMethods.prototype, "saveSensorSnapshot", null);
DataSavingWriteMethods = DataSavingWriteMethods_1 = __decorate([
    (0, tsoa_1.Security)("api_key"),
    (0, tsoa_1.Route)(`api/v1/snapshot`),
    (0, tsoa_1.SuccessResponse)(200, "Ok"),
    (0, tsoa_1.Response)(400, "Bad Request"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(403, "Forbidden"),
    (0, tsoa_1.Response)(404, "Not Found"),
    (0, tsoa_1.Response)(408, "Request Timeout")
], DataSavingWriteMethods);
exports.DataSavingWriteMethods = DataSavingWriteMethods;
//# sourceMappingURL=dataSavingWriteMethods.js.map