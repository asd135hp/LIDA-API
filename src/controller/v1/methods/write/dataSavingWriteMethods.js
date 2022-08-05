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
const luxon_1 = require("luxon");
const helper_1 = require("../../../../utility/helper");
const firebaseService_1 = require("../../services/firebaseFreetier/firebaseService");
const getEvent = databaseEvent_1.default.getCompactEvent;
const firestore = firebaseService_1.persistentFirebaseConnection.firestoreService;
const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
let DataSavingWriteMethods = DataSavingWriteMethods_1 = class DataSavingWriteMethods extends tsoa_1.Controller {
    constructor() {
        super();
        this.service = DataSavingWriteMethods_1.mainService;
    }
    get currentUnixTimestamp() { return luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger(); }
    saveSensorSnapshot(accessToken, sensor, sensorData, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = (0, helper_1.getDateRangeString)({ startDate, endDate });
            constants_1.logger.info(`DataSavingWriteMethods: Saving sensor snapshot to the storage from ${t.start} to ${t.end}`);
            const event = yield this.service.uploadSensorSnapshot({
                sensor: JSON.parse(sensor),
                sensorData: JSON.parse(sensorData)
            }, { startDate, endDate });
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            return getEvent(event);
        });
    }
    saveLogSnapshot(accessToken, actuatorLogs, sensorLogs, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = (0, helper_1.getDateRangeString)({ startDate, endDate });
            constants_1.logger.info(`DataSavingWriteMethods: Saving log snapshot to the storage from ${t.start} to ${t.end}`);
            const event = yield this.service.uploadLogSnapshot({
                sensor: JSON.parse(sensorLogs),
                actuator: JSON.parse(actuatorLogs)
            }, { startDate, endDate });
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            return getEvent(event);
        });
    }
    saveDailySensorSnapshot(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("DataSavingWriteMethods: Saving daily sensor snapshot to the storage");
            const now = this.currentUnixTimestamp;
            const dateRange = { startDate: now - 3600 * 24, endDate: now };
            const event = yield this.service.uploadSensorSnapshot({
                sensor: yield firestore.getCollection("sensors").then(result => result.docs.map(doc => doc.data())),
                sensorData: yield firestore.getCollection("sensorData").then(result => result.docs.map(doc => doc.data()))
            }, dateRange);
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            else {
                yield firestore.deleteCollection("sensorData");
                yield realtime.deleteContent("sensorData");
            }
            return getEvent(event);
        });
    }
    saveDailyLogSnapshot(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.info("DataSavingWriteMethods: Saving daily logs snapshot to the storage");
            const now = this.currentUnixTimestamp;
            const dateRange = { startDate: now - 3600 * 24, endDate: now };
            const event = yield this.service.uploadLogSnapshot({
                sensor: yield firestore.getCollection("logs/sensor").then(result => result.docs.map(doc => doc.data())),
                actuator: yield firestore.getCollection("logs/actuator").then(result => result.docs.map(doc => doc.data()))
            }, dateRange);
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            else {
                yield firestore.deleteDocument("logs");
                yield realtime.deleteContent("logs");
            }
            return getEvent(event);
        });
    }
    deleteSensorSnapshots(accessToken, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = (0, helper_1.getDateRangeString)({ startDate, endDate });
            constants_1.logger.info(`DataSavingWriteMethods: Deleting sensor snapshot from the storage from ${t.start} to ${t.end}`);
            const event = yield this.service.deleteSensorSnapshots({ startDate, endDate });
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            return getEvent(event);
        });
    }
    deleteLogSnapshots(accessToken, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = (0, helper_1.getDateRangeString)({ startDate, endDate });
            constants_1.logger.info(`DataSavingWriteMethods: Deleting log snapshots from the storage from ${t.start} to ${t.end}`);
            const event = yield this.service.deleteLogSnapshots({ startDate, endDate });
            if (event instanceof databaseErrorEvent_1.default) {
                this.setStatus(event.content.values.statusCode);
            }
            return getEvent(event);
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("sensor/save"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)())
], DataSavingWriteMethods.prototype, "saveSensorSnapshot", null);
__decorate([
    (0, tsoa_1.Post)("log/save"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)())
], DataSavingWriteMethods.prototype, "saveLogSnapshot", null);
__decorate([
    (0, tsoa_1.Post)("sensor/save/daily"),
    __param(0, (0, tsoa_1.Query)())
], DataSavingWriteMethods.prototype, "saveDailySensorSnapshot", null);
__decorate([
    (0, tsoa_1.Post)("log/save/daily"),
    __param(0, (0, tsoa_1.Query)())
], DataSavingWriteMethods.prototype, "saveDailyLogSnapshot", null);
__decorate([
    (0, tsoa_1.Delete)("sensor/delete"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)())
], DataSavingWriteMethods.prototype, "deleteSensorSnapshots", null);
__decorate([
    (0, tsoa_1.Delete)("log/delete"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)())
], DataSavingWriteMethods.prototype, "deleteLogSnapshots", null);
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