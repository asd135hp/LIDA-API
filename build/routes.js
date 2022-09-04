"use strict";
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
exports.RegisterRoutes = void 0;
const runtime_1 = require("@tsoa/runtime");
const actuatorReadMethods_1 = require("./../src/controller/v1/methods/read/actuatorReadMethods");
const sensorReadMethods_1 = require("./../src/controller/v1/methods/read/sensorReadMethods");
const systemCommandReadMethods_1 = require("./../src/controller/v1/methods/read/systemCommandReadMethods");
const systemLogsReadMethods_1 = require("./../src/controller/v1/methods/read/systemLogsReadMethods");
const actuatorWriteMethods_1 = require("./../src/controller/v1/methods/write/actuatorWriteMethods");
const dataSavingWriteMethods_1 = require("./../src/controller/v1/methods/write/dataSavingWriteMethods");
const sensorWriteMethods_1 = require("./../src/controller/v1/methods/write/sensorWriteMethods");
const systemCommandWriteMethods_1 = require("./../src/controller/v1/methods/write/systemCommandWriteMethods");
const systemLogsWriteMethods_1 = require("./../src/controller/v1/methods/write/systemLogsWriteMethods");
const securityMethods_1 = require("./../src/controller/security/methods/securityMethods");
const authentication_1 = require("./../src/controller/security/authentication");
const promiseAny = require('promise.any');
const models = {
    "ActuatorDTO": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "type": { "dataType": "string", "required": true },
            "isRunning": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "ActuatorConfigType": {
        "dataType": "refEnum",
        "enums": [0, 1, 2],
    },
    "ToggleConfig": {
        "dataType": "refObject",
        "properties": {
            "state": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "MotorConfig": {
        "dataType": "refObject",
        "properties": {
            "duration": { "dataType": "double", "required": true },
            "isClockwise": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "ActuatorConfigDTO": {
        "dataType": "refObject",
        "properties": {
            "actuatorName": { "dataType": "string", "required": true },
            "timeStamp": { "dataType": "double", "required": true },
            "type": { "ref": "ActuatorConfigType", "required": true },
            "timesPerDay": { "dataType": "double" },
            "toggleConfig": { "ref": "ToggleConfig" },
            "motorConfig": { "dataType": "array", "array": { "dataType": "refObject", "ref": "MotorConfig" } },
        },
        "additionalProperties": false,
    },
    "SensorDTO": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "type": { "dataType": "string", "required": true },
            "isRunning": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "SensorDataDTO": {
        "dataType": "refObject",
        "properties": {
            "sensorName": { "dataType": "string", "required": true },
            "value": { "dataType": "double", "required": true },
            "timeStamp": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    "SnapshotDownloadResponse": {
        "dataType": "refObject",
        "properties": {
            "newFileName": { "dataType": "string", "required": true },
            "downloadUrl": { "dataType": "string", "required": true },
            "startDate": { "dataType": "double", "required": true },
            "endDate": { "dataType": "double", "required": true },
            "decompressionByteLength": { "dataType": "double", "required": true },
            "note": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "SystemCommandDTO": {
        "dataType": "refObject",
        "properties": {
            "isStart": { "dataType": "boolean", "required": true },
            "isPause": { "dataType": "boolean", "required": true },
            "isStop": { "dataType": "boolean", "required": true },
            "isRestart": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "LogDTO": {
        "dataType": "refObject",
        "properties": {
            "timeStamp": { "dataType": "double", "required": true },
            "logContent": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "IterableJson": {
        "dataType": "refObject",
        "properties": {},
        "additionalProperties": { "dataType": "any" },
    },
    "Report": {
        "dataType": "refObject",
        "properties": {
            "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["Ok"] }, { "dataType": "enum", "enums": ["Error"] }, { "dataType": "enum", "enums": ["Unknown"] }], "required": true },
            "info": { "dataType": "string", "required": true },
            "error": { "dataType": "string", "required": true },
            "warning": { "dataType": "string", "required": true },
            "values": { "ref": "IterableJson" },
        },
        "additionalProperties": false,
    },
    "Timestamp": {
        "dataType": "refObject",
        "properties": {
            "timeStamp": { "dataType": "double", "required": true },
            "isoTimeStamp": { "dataType": "string", "required": true },
            "normalTimeStamp": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "CommonEventFormat": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "Report" }, { "ref": "Timestamp" }], "validators": {} },
    },
    "DatabaseEvent": {
        "dataType": "refObject",
        "properties": {
            "content": { "ref": "CommonEventFormat", "required": true },
        },
        "additionalProperties": false,
    },
    "Actuator": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "type": { "dataType": "string", "required": true },
            "isRunning": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    "UpdatingActuator": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "type": { "dataType": "string" },
            "isRunning": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    "ActuatorConfig": {
        "dataType": "refObject",
        "properties": {
            "timeStamp": { "dataType": "double", "required": true },
            "toggleConfig": { "ref": "ToggleConfig" },
            "motorConfig": { "dataType": "array", "array": { "dataType": "refObject", "ref": "MotorConfig" } },
            "timesPerDay": { "dataType": "double" },
        },
        "additionalProperties": false,
    },
    "Sensor": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "type": { "dataType": "string", "required": true },
            "isRunning": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    "UpdatingSensor": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "type": { "dataType": "string" },
            "isRunning": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    "SensorData": {
        "dataType": "refObject",
        "properties": {
            "value": { "dataType": "double", "required": true },
            "timeStamp": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    "SystemCommand": {
        "dataType": "refObject",
        "properties": {
            "start": { "dataType": "boolean", "required": true },
            "pause": { "dataType": "boolean", "required": true },
            "stop": { "dataType": "boolean", "required": true },
            "restart": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "User": {
        "dataType": "refObject",
        "properties": {
            "displayName": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "phoneNumber": { "dataType": "string", "required": true },
            "photoURL": { "dataType": "string", "required": true },
            "isLoggedOut": { "dataType": "boolean", "required": true },
            "emailVerified": { "dataType": "boolean", "required": true },
            "accessToken": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
};
const validationService = new runtime_1.ValidationService(models);
function RegisterRoutes(app) {
    app.get('/api/v1/actuator/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(actuatorReadMethods_1.ActuatorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(actuatorReadMethods_1.ActuatorReadMethods.prototype.getActuators)), function ActuatorReadMethods_getActuators(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new actuatorReadMethods_1.ActuatorReadMethods();
            const promise = controller.getActuators.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/actuator/:typeOrName/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(actuatorReadMethods_1.ActuatorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(actuatorReadMethods_1.ActuatorReadMethods.prototype.getCategorizedActuators)), function ActuatorReadMethods_getCategorizedActuators(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            typeOrName: { "in": "path", "name": "typeOrName", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new actuatorReadMethods_1.ActuatorReadMethods();
            const promise = controller.getCategorizedActuators.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/actuator/config/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(actuatorReadMethods_1.ActuatorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(actuatorReadMethods_1.ActuatorReadMethods.prototype.getActuatorConfigs)), function ActuatorReadMethods_getActuatorConfigs(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new actuatorReadMethods_1.ActuatorReadMethods();
            const promise = controller.getActuatorConfigs.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/actuator/config/proposed/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(actuatorReadMethods_1.ActuatorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(actuatorReadMethods_1.ActuatorReadMethods.prototype.getProposedActuatorConfigs)), function ActuatorReadMethods_getProposedActuatorConfigs(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new actuatorReadMethods_1.ActuatorReadMethods();
            const promise = controller.getProposedActuatorConfigs.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/sensor/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods.prototype.getSensors)), function SensorReadMethods_getSensors(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new sensorReadMethods_1.SensorReadMethods();
            const promise = controller.getSensors.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/sensor/:typeOrName/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods.prototype.getCategorizedSensors)), function SensorReadMethods_getCategorizedSensors(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            typeOrName: { "in": "path", "name": "typeOrName", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new sensorReadMethods_1.SensorReadMethods();
            const promise = controller.getCategorizedSensors.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/sensor/data/fetchAll', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods.prototype.getSensorData)), function SensorReadMethods_getSensorData(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            startDate: { "default": 0, "in": "query", "name": "startDate", "dataType": "double" },
            endDate: { "in": "query", "name": "endDate", "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new sensorReadMethods_1.SensorReadMethods();
            const promise = controller.getSensorData.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/sensor/:name/data/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods.prototype.getSensorDataByName)), function SensorReadMethods_getSensorDataByName(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            name: { "in": "path", "name": "name", "required": true, "dataType": "string" },
            startDate: { "default": 0, "in": "query", "name": "startDate", "dataType": "double" },
            endDate: { "in": "query", "name": "endDate", "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new sensorReadMethods_1.SensorReadMethods();
            const promise = controller.getSensorDataByName.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/sensor/snapshot/:runNumber/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods.prototype.getSensorDataRunSnapshot)), function SensorReadMethods_getSensorDataRunSnapshot(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            runNumber: { "in": "path", "name": "runNumber", "required": true, "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new sensorReadMethods_1.SensorReadMethods();
            const promise = controller.getSensorDataRunSnapshot.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/systemCommand/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(systemCommandReadMethods_1.SystemCommandReadMethods)), ...((0, runtime_1.fetchMiddlewares)(systemCommandReadMethods_1.SystemCommandReadMethods.prototype.getSystemCommands)), function SystemCommandReadMethods_getSystemCommands(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemCommandReadMethods_1.SystemCommandReadMethods();
            const promise = controller.getSystemCommands.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/systemCommand/proposed/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(systemCommandReadMethods_1.SystemCommandReadMethods)), ...((0, runtime_1.fetchMiddlewares)(systemCommandReadMethods_1.SystemCommandReadMethods.prototype.getProposedSystemCommands)), function SystemCommandReadMethods_getProposedSystemCommands(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemCommandReadMethods_1.SystemCommandReadMethods();
            const promise = controller.getProposedSystemCommands.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/log/sensor/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(systemLogsReadMethods_1.SystemLogsReadMethods)), ...((0, runtime_1.fetchMiddlewares)(systemLogsReadMethods_1.SystemLogsReadMethods.prototype.getSensorLogs)), function SystemLogsReadMethods_getSensorLogs(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemLogsReadMethods_1.SystemLogsReadMethods();
            const promise = controller.getSensorLogs.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/log/actuator/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(systemLogsReadMethods_1.SystemLogsReadMethods)), ...((0, runtime_1.fetchMiddlewares)(systemLogsReadMethods_1.SystemLogsReadMethods.prototype.getActuatorLogs)), function SystemLogsReadMethods_getActuatorLogs(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemLogsReadMethods_1.SystemLogsReadMethods();
            const promise = controller.getActuatorLogs.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/log/systemCommand/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(systemLogsReadMethods_1.SystemLogsReadMethods)), ...((0, runtime_1.fetchMiddlewares)(systemLogsReadMethods_1.SystemLogsReadMethods.prototype.getSystemCommandLogs)), function SystemLogsReadMethods_getSystemCommandLogs(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemLogsReadMethods_1.SystemLogsReadMethods();
            const promise = controller.getSystemCommandLogs.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/actuator/add', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(actuatorWriteMethods_1.ActuatorWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(actuatorWriteMethods_1.ActuatorWriteMethods.prototype.addActuator)), function ActuatorWriteMethods_addActuator(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            actuator: { "in": "body-prop", "name": "actuator", "required": true, "ref": "Actuator" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new actuatorWriteMethods_1.ActuatorWriteMethods();
            const promise = controller.addActuator.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/actuator/update', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(actuatorWriteMethods_1.ActuatorWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(actuatorWriteMethods_1.ActuatorWriteMethods.prototype.updateActuator)), function ActuatorWriteMethods_updateActuator(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            actuator: { "in": "body-prop", "name": "actuator", "required": true, "ref": "UpdatingActuator" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new actuatorWriteMethods_1.ActuatorWriteMethods();
            const promise = controller.updateActuator.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/actuator/:actuatorName/config/update', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(actuatorWriteMethods_1.ActuatorWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(actuatorWriteMethods_1.ActuatorWriteMethods.prototype.updateActuatorConfig)), function ActuatorWriteMethods_updateActuatorConfig(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            actuatorName: { "in": "path", "name": "actuatorName", "required": true, "dataType": "string" },
            actuatorConfig: { "in": "body-prop", "name": "actuatorConfig", "required": true, "ref": "ActuatorConfig" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new actuatorWriteMethods_1.ActuatorWriteMethods();
            const promise = controller.updateActuatorConfig.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/actuator/:actuatorName/config/proposed/update', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(actuatorWriteMethods_1.ActuatorWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(actuatorWriteMethods_1.ActuatorWriteMethods.prototype.updateProposedActuatorConfig)), function ActuatorWriteMethods_updateProposedActuatorConfig(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            actuatorName: { "in": "path", "name": "actuatorName", "required": true, "dataType": "string" },
            actuatorConfig: { "in": "body-prop", "name": "actuatorConfig", "required": true, "ref": "ActuatorConfig" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new actuatorWriteMethods_1.ActuatorWriteMethods();
            const promise = controller.updateProposedActuatorConfig.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.delete('/api/v1/snapshot/sensor/:runNumber/delete', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(dataSavingWriteMethods_1.DataSavingWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(dataSavingWriteMethods_1.DataSavingWriteMethods.prototype.deleteSensorSnapshot)), function DataSavingWriteMethods_deleteSensorSnapshot(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            runNumber: { "in": "path", "name": "runNumber", "required": true, "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new dataSavingWriteMethods_1.DataSavingWriteMethods();
            const promise = controller.deleteSensorSnapshot.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/sensor/add', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(sensorWriteMethods_1.SensorWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(sensorWriteMethods_1.SensorWriteMethods.prototype.addSensor)), function SensorWriteMethods_addSensor(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            sensor: { "in": "body-prop", "name": "sensor", "required": true, "ref": "Sensor" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new sensorWriteMethods_1.SensorWriteMethods();
            const promise = controller.addSensor.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/sensor/update', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(sensorWriteMethods_1.SensorWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(sensorWriteMethods_1.SensorWriteMethods.prototype.updateSensor)), function SensorWriteMethods_updateSensor(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            sensor: { "in": "body-prop", "name": "sensor", "required": true, "ref": "UpdatingSensor" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new sensorWriteMethods_1.SensorWriteMethods();
            const promise = controller.updateSensor.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/sensor/:sensorName/data/add', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(sensorWriteMethods_1.SensorWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(sensorWriteMethods_1.SensorWriteMethods.prototype.addSensorData)), function SensorWriteMethods_addSensorData(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            sensorName: { "in": "path", "name": "sensorName", "required": true, "dataType": "string" },
            sensorData: { "in": "body-prop", "name": "sensorData", "required": true, "ref": "SensorData" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new sensorWriteMethods_1.SensorWriteMethods();
            const promise = controller.addSensorData.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/systemCommand/startSystem', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(systemCommandWriteMethods_1.SystemCommandWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(systemCommandWriteMethods_1.SystemCommandWriteMethods.prototype.startSystem)), function SystemCommandWriteMethods_startSystem(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemCommandWriteMethods_1.SystemCommandWriteMethods();
            const promise = controller.startSystem.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/systemCommand/pauseSystem', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(systemCommandWriteMethods_1.SystemCommandWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(systemCommandWriteMethods_1.SystemCommandWriteMethods.prototype.pauseSystem)), function SystemCommandWriteMethods_pauseSystem(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemCommandWriteMethods_1.SystemCommandWriteMethods();
            const promise = controller.pauseSystem.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/systemCommand/stopSystem', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(systemCommandWriteMethods_1.SystemCommandWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(systemCommandWriteMethods_1.SystemCommandWriteMethods.prototype.stopSystem)), function SystemCommandWriteMethods_stopSystem(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemCommandWriteMethods_1.SystemCommandWriteMethods();
            const promise = controller.stopSystem.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/systemCommand/restartSystem', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(systemCommandWriteMethods_1.SystemCommandWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(systemCommandWriteMethods_1.SystemCommandWriteMethods.prototype.restartSystem)), function SystemCommandWriteMethods_restartSystem(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemCommandWriteMethods_1.SystemCommandWriteMethods();
            const promise = controller.restartSystem.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/systemCommand/flags/commit', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(systemCommandWriteMethods_1.SystemCommandWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(systemCommandWriteMethods_1.SystemCommandWriteMethods.prototype.commitSystemFlags)), function SystemCommandWriteMethods_commitSystemFlags(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            flags: { "in": "body-prop", "name": "flags", "required": true, "ref": "SystemCommand" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemCommandWriteMethods_1.SystemCommandWriteMethods();
            const promise = controller.commitSystemFlags.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/log/sensor/add', ...((0, runtime_1.fetchMiddlewares)(systemLogsWriteMethods_1.SystemLogsWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(systemLogsWriteMethods_1.SystemLogsWriteMethods.prototype.addSensorLog)), function SystemLogsWriteMethods_addSensorLog(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            logContent: { "in": "body-prop", "name": "logContent", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemLogsWriteMethods_1.SystemLogsWriteMethods();
            const promise = controller.addSensorLog.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/log/actuator/add', ...((0, runtime_1.fetchMiddlewares)(systemLogsWriteMethods_1.SystemLogsWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(systemLogsWriteMethods_1.SystemLogsWriteMethods.prototype.addActuatorLog)), function SystemLogsWriteMethods_addActuatorLog(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            logContent: { "in": "body-prop", "name": "logContent", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemLogsWriteMethods_1.SystemLogsWriteMethods();
            const promise = controller.addActuatorLog.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/log/systemCommand/add', ...((0, runtime_1.fetchMiddlewares)(systemLogsWriteMethods_1.SystemLogsWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(systemLogsWriteMethods_1.SystemLogsWriteMethods.prototype.addSystemCommandLog)), function SystemLogsWriteMethods_addSystemCommandLog(request, response, next) {
        const args = {
            accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            logContent: { "in": "body-prop", "name": "logContent", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new systemLogsWriteMethods_1.SystemLogsWriteMethods();
            const promise = controller.addSystemCommandLog.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/register', ...((0, runtime_1.fetchMiddlewares)(securityMethods_1.SecurityMethods)), ...((0, runtime_1.fetchMiddlewares)(securityMethods_1.SecurityMethods.prototype.register)), function SecurityMethods_register(request, response, next) {
        const args = {
            email: { "in": "body-prop", "name": "email", "required": true, "dataType": "string" },
            password: { "in": "body-prop", "name": "password", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new securityMethods_1.SecurityMethods();
            const promise = controller.register.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/login', ...((0, runtime_1.fetchMiddlewares)(securityMethods_1.SecurityMethods)), ...((0, runtime_1.fetchMiddlewares)(securityMethods_1.SecurityMethods.prototype.login)), function SecurityMethods_login(request, response, next) {
        const args = {
            email: { "in": "body-prop", "name": "email", "required": true, "dataType": "string" },
            password: { "in": "body-prop", "name": "password", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new securityMethods_1.SecurityMethods();
            const promise = controller.login.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/login/refresh', ...((0, runtime_1.fetchMiddlewares)(securityMethods_1.SecurityMethods)), ...((0, runtime_1.fetchMiddlewares)(securityMethods_1.SecurityMethods.prototype.refreshLoginCredentials)), function SecurityMethods_refreshLoginCredentials(request, response, next) {
        const args = {
            email: { "in": "body-prop", "name": "email", "required": true, "dataType": "string" },
            password: { "in": "body-prop", "name": "password", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new securityMethods_1.SecurityMethods();
            const promise = controller.refreshLoginCredentials.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    function authenticateMiddleware(security = []) {
        return function runAuthenticationMiddleware(request, _response, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const failedAttempts = [];
                const pushAndRethrow = (error) => {
                    failedAttempts.push(error);
                    throw error;
                };
                const secMethodOrPromises = [];
                for (const secMethod of security) {
                    if (Object.keys(secMethod).length > 1) {
                        const secMethodAndPromises = [];
                        for (const name in secMethod) {
                            secMethodAndPromises.push((0, authentication_1.expressAuthentication)(request, name, secMethod[name])
                                .catch(pushAndRethrow));
                        }
                        secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                            .then(users => { return users[0]; }));
                    }
                    else {
                        for (const name in secMethod) {
                            secMethodOrPromises.push((0, authentication_1.expressAuthentication)(request, name, secMethod[name])
                                .catch(pushAndRethrow));
                        }
                    }
                }
                try {
                    request['user'] = yield promiseAny(secMethodOrPromises);
                    next();
                }
                catch (err) {
                    const error = failedAttempts.pop();
                    error.status = error.status || 401;
                    next(error);
                }
            });
        };
    }
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
}
exports.RegisterRoutes = RegisterRoutes;
//# sourceMappingURL=routes.js.map