/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ActuatorReadMethods } from './../src/controller/v1/methods/read/actuatorReadMethods';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DataSavingReadMethods } from './../src/controller/v1/methods/read/dataSavingReadMethods';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SensorReadMethods } from './../src/controller/v1/methods/read/sensorReadMethods';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SystemCommandReadMethods } from './../src/controller/v1/methods/read/systemCommandReadMethods';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SystemLogsReadMethods } from './../src/controller/v1/methods/read/systemLogsReadMethods';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ActuatorWriteMethods } from './../src/controller/v1/methods/write/actuatorWriteMethods';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DataSavingWriteMethods } from './../src/controller/v1/methods/write/dataSavingWriteMethods';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SensorWriteMethods } from './../src/controller/v1/methods/write/sensorWriteMethods';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SystemCommandWriteMethods } from './../src/controller/v1/methods/write/systemCommandWriteMethods';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SystemLogsWriteMethods } from './../src/controller/v1/methods/write/systemLogsWriteMethods';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SecurityMethods } from './../src/controller/security/methods/securityMethods';
import { expressAuthentication } from './../src/controller/security/authentication';
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
import type { RequestHandler } from 'express';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ActuatorDTO": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "isRunning": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ActuatorConfigType": {
        "dataType": "refEnum",
        "enums": [0,1,2],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ToggleConfig": {
        "dataType": "refObject",
        "properties": {
            "state": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MotorConfig": {
        "dataType": "refObject",
        "properties": {
            "duration": {"dataType":"double","required":true},
            "isClockwise": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ActuatorConfigDTO": {
        "dataType": "refObject",
        "properties": {
            "actuatorName": {"dataType":"string","required":true},
            "timeStamp": {"dataType":"double","required":true},
            "type": {"ref":"ActuatorConfigType","required":true},
            "timesPerDay": {"dataType":"double"},
            "toggleConfig": {"ref":"ToggleConfig"},
            "motorConfig": {"dataType":"array","array":{"dataType":"refObject","ref":"MotorConfig"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SnapshotDownloadResponse": {
        "dataType": "refObject",
        "properties": {
            "newFileName": {"dataType":"string","required":true},
            "downloadUrl": {"dataType":"string","required":true},
            "decompressionByteLength": {"dataType":"double","required":true},
            "note": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SensorDTO": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "isRunning": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SensorDataDTO": {
        "dataType": "refObject",
        "properties": {
            "sensorName": {"dataType":"string","required":true},
            "value": {"dataType":"double","required":true},
            "timeStamp": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SystemCommandDTO": {
        "dataType": "refObject",
        "properties": {
            "isStart": {"dataType":"boolean","required":true},
            "isPause": {"dataType":"boolean","required":true},
            "isStop": {"dataType":"boolean","required":true},
            "isRestart": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LogDTO": {
        "dataType": "refObject",
        "properties": {
            "timeStamp": {"dataType":"double","required":true},
            "logContent": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IterableJson": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": {"dataType":"any"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Report": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Ok"]},{"dataType":"enum","enums":["Error"]},{"dataType":"enum","enums":["Unknown"]}],"required":true},
            "info": {"dataType":"string","required":true},
            "error": {"dataType":"string","required":true},
            "warning": {"dataType":"string","required":true},
            "values": {"ref":"IterableJson"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Timestamp": {
        "dataType": "refObject",
        "properties": {
            "timeStamp": {"dataType":"double","required":true},
            "isoTimeStamp": {"dataType":"string","required":true},
            "normalTimeStamp": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommonEventFormat": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Report"},{"ref":"Timestamp"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DatabaseEvent": {
        "dataType": "refObject",
        "properties": {
            "content": {"ref":"CommonEventFormat","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Actuator": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "isRunning": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdatingActuator": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "isRunning": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ActuatorConfig": {
        "dataType": "refObject",
        "properties": {
            "timeStamp": {"dataType":"double","required":true},
            "toggleConfig": {"ref":"ToggleConfig"},
            "motorConfig": {"dataType":"array","array":{"dataType":"refObject","ref":"MotorConfig"}},
            "timesPerDay": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Sensor": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "isRunning": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdatingSensor": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "isRunning": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SensorData": {
        "dataType": "refObject",
        "properties": {
            "value": {"dataType":"double","required":true},
            "timeStamp": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DatabaseSensorData": {
        "dataType": "refObject",
        "properties": {
            "sensorName": {"dataType":"string","required":true},
            "value": {"dataType":"double","required":true},
            "timeStamp": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SystemCommand": {
        "dataType": "refObject",
        "properties": {
            "start": {"dataType":"boolean","required":true},
            "pause": {"dataType":"boolean","required":true},
            "stop": {"dataType":"boolean","required":true},
            "restart": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "displayName": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phoneNumber": {"dataType":"string","required":true},
            "photoURL": {"dataType":"string","required":true},
            "isLoggedOut": {"dataType":"boolean","required":true},
            "emailVerified": {"dataType":"boolean","required":true},
            "accessToken": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/api/v1/actuator/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ActuatorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(ActuatorReadMethods.prototype.getActuators)),

            function ActuatorReadMethods_getActuators(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ActuatorReadMethods();


              const promise = controller.getActuators.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/actuator/:typeOrName/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ActuatorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(ActuatorReadMethods.prototype.getCategorizedActuators)),

            function ActuatorReadMethods_getCategorizedActuators(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    typeOrName: {"in":"path","name":"typeOrName","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ActuatorReadMethods();


              const promise = controller.getCategorizedActuators.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/actuator/config/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ActuatorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(ActuatorReadMethods.prototype.getActuatorConfigs)),

            function ActuatorReadMethods_getActuatorConfigs(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ActuatorReadMethods();


              const promise = controller.getActuatorConfigs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/actuator/config/proposed/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ActuatorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(ActuatorReadMethods.prototype.getProposedActuatorConfigs)),

            function ActuatorReadMethods_getProposedActuatorConfigs(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ActuatorReadMethods();


              const promise = controller.getProposedActuatorConfigs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/snapshot/sensor/:runNumber/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DataSavingReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(DataSavingReadMethods.prototype.retrieveSensorDataRunSnapshot)),

            function DataSavingReadMethods_retrieveSensorDataRunSnapshot(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    runNumber: {"in":"path","name":"runNumber","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DataSavingReadMethods();


              const promise = controller.retrieveSensorDataRunSnapshot.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/sensor/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods.prototype.getSensors)),

            function SensorReadMethods_getSensors(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorReadMethods();


              const promise = controller.getSensors.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/sensor/:typeOrName/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods.prototype.getCategorizedSensors)),

            function SensorReadMethods_getCategorizedSensors(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    typeOrName: {"in":"path","name":"typeOrName","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorReadMethods();


              const promise = controller.getCategorizedSensors.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/sensor/data/fetchAll',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods.prototype.getSensorData)),

            function SensorReadMethods_getSensorData(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    startDate: {"default":0,"in":"query","name":"startDate","dataType":"double"},
                    endDate: {"in":"query","name":"endDate","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorReadMethods();


              const promise = controller.getSensorData.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/sensor/:name/data/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods.prototype.getSensorDataByName)),

            function SensorReadMethods_getSensorDataByName(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    name: {"in":"path","name":"name","required":true,"dataType":"string"},
                    startDate: {"default":0,"in":"query","name":"startDate","dataType":"double"},
                    endDate: {"in":"query","name":"endDate","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorReadMethods();


              const promise = controller.getSensorDataByName.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/sensor/data/latest/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods.prototype.getLatestSensorData)),

            function SensorReadMethods_getLatestSensorData(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorReadMethods();


              const promise = controller.getLatestSensorData.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/sensor/:name/data/latest/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods.prototype.getLatestSensorDataByName)),

            function SensorReadMethods_getLatestSensorDataByName(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    name: {"in":"path","name":"name","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorReadMethods();


              const promise = controller.getLatestSensorDataByName.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/sensor/snapshot/:runNumber/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorReadMethods.prototype.getSensorDataRunSnapshot)),

            function SensorReadMethods_getSensorDataRunSnapshot(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    runNumber: {"in":"path","name":"runNumber","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorReadMethods();


              const promise = controller.getSensorDataRunSnapshot.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/systemCommand/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandReadMethods.prototype.getSystemCommands)),

            function SystemCommandReadMethods_getSystemCommands(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemCommandReadMethods();


              const promise = controller.getSystemCommands.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/systemCommand/proposed/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandReadMethods.prototype.getProposedSystemCommands)),

            function SystemCommandReadMethods_getProposedSystemCommands(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemCommandReadMethods();


              const promise = controller.getProposedSystemCommands.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/log/sensor/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsReadMethods.prototype.getSensorLogs)),

            function SystemLogsReadMethods_getSensorLogs(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemLogsReadMethods();


              const promise = controller.getSensorLogs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/log/actuator/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsReadMethods.prototype.getActuatorLogs)),

            function SystemLogsReadMethods_getActuatorLogs(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemLogsReadMethods();


              const promise = controller.getActuatorLogs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/log/systemCommand/get',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsReadMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsReadMethods.prototype.getSystemCommandLogs)),

            function SystemLogsReadMethods_getSystemCommandLogs(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemLogsReadMethods();


              const promise = controller.getSystemCommandLogs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/actuator/add',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ActuatorWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(ActuatorWriteMethods.prototype.addActuator)),

            function ActuatorWriteMethods_addActuator(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    actuator: {"in":"body-prop","name":"actuator","required":true,"ref":"Actuator"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ActuatorWriteMethods();


              const promise = controller.addActuator.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/v1/actuator/update',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ActuatorWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(ActuatorWriteMethods.prototype.updateActuator)),

            function ActuatorWriteMethods_updateActuator(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    actuator: {"in":"body-prop","name":"actuator","required":true,"ref":"UpdatingActuator"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ActuatorWriteMethods();


              const promise = controller.updateActuator.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/actuator/:actuatorName/config/update',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ActuatorWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(ActuatorWriteMethods.prototype.updateActuatorConfig)),

            function ActuatorWriteMethods_updateActuatorConfig(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    actuatorName: {"in":"path","name":"actuatorName","required":true,"dataType":"string"},
                    actuatorConfig: {"in":"body-prop","name":"actuatorConfig","required":true,"ref":"ActuatorConfig"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ActuatorWriteMethods();


              const promise = controller.updateActuatorConfig.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/v1/actuator/:actuatorName/config/proposed/update',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ActuatorWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(ActuatorWriteMethods.prototype.updateProposedActuatorConfig)),

            function ActuatorWriteMethods_updateProposedActuatorConfig(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    actuatorName: {"in":"path","name":"actuatorName","required":true,"dataType":"string"},
                    actuatorConfig: {"in":"body-prop","name":"actuatorConfig","required":true,"ref":"ActuatorConfig"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ActuatorWriteMethods();


              const promise = controller.updateProposedActuatorConfig.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/v1/snapshot/sensor/:runNumber/delete',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DataSavingWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(DataSavingWriteMethods.prototype.deleteSensorSnapshot)),

            function DataSavingWriteMethods_deleteSensorSnapshot(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    runNumber: {"in":"path","name":"runNumber","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DataSavingWriteMethods();


              const promise = controller.deleteSensorSnapshot.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/snapshot/sensor/save',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DataSavingWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(DataSavingWriteMethods.prototype.saveSensorSnapshot)),

            function DataSavingWriteMethods_saveSensorSnapshot(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DataSavingWriteMethods();


              const promise = controller.saveSensorSnapshot.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/sensor/add',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorWriteMethods.prototype.addSensor)),

            function SensorWriteMethods_addSensor(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    sensor: {"in":"body-prop","name":"sensor","required":true,"ref":"Sensor"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorWriteMethods();


              const promise = controller.addSensor.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/v1/sensor/update',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorWriteMethods.prototype.updateSensor)),

            function SensorWriteMethods_updateSensor(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    sensor: {"in":"body-prop","name":"sensor","required":true,"ref":"UpdatingSensor"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorWriteMethods();


              const promise = controller.updateSensor.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/sensor/:sensorName/data/add',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorWriteMethods.prototype.addSensorData)),

            function SensorWriteMethods_addSensorData(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    sensorName: {"in":"path","name":"sensorName","required":true,"dataType":"string"},
                    sensorData: {"in":"body-prop","name":"sensorData","required":true,"ref":"SensorData"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorWriteMethods();


              const promise = controller.addSensorData.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/sensor/data/addAll',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SensorWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SensorWriteMethods.prototype.addSensorDataByBundle)),

            function SensorWriteMethods_addSensorDataByBundle(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    sensorData: {"in":"body-prop","name":"sensorData","required":true,"dataType":"array","array":{"dataType":"refObject","ref":"DatabaseSensorData"}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SensorWriteMethods();


              const promise = controller.addSensorDataByBundle.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/systemCommand/startSystem',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandWriteMethods.prototype.startSystem)),

            function SystemCommandWriteMethods_startSystem(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemCommandWriteMethods();


              const promise = controller.startSystem.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/systemCommand/pauseSystem',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandWriteMethods.prototype.pauseSystem)),

            function SystemCommandWriteMethods_pauseSystem(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemCommandWriteMethods();


              const promise = controller.pauseSystem.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/systemCommand/stopSystem',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandWriteMethods.prototype.stopSystem)),

            function SystemCommandWriteMethods_stopSystem(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemCommandWriteMethods();


              const promise = controller.stopSystem.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/systemCommand/restartSystem',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandWriteMethods.prototype.restartSystem)),

            function SystemCommandWriteMethods_restartSystem(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemCommandWriteMethods();


              const promise = controller.restartSystem.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/systemCommand/flags/commit',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemCommandWriteMethods.prototype.commitSystemFlags)),

            function SystemCommandWriteMethods_commitSystemFlags(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    flags: {"in":"body-prop","name":"flags","required":true,"ref":"SystemCommand"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemCommandWriteMethods();


              const promise = controller.commitSystemFlags.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/log/sensor/add',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsWriteMethods.prototype.addSensorLog)),

            function SystemLogsWriteMethods_addSensorLog(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    logContent: {"in":"body-prop","name":"logContent","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemLogsWriteMethods();


              const promise = controller.addSensorLog.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/log/actuator/add',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsWriteMethods.prototype.addActuatorLog)),

            function SystemLogsWriteMethods_addActuatorLog(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    logContent: {"in":"body-prop","name":"logContent","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemLogsWriteMethods();


              const promise = controller.addActuatorLog.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/log/systemCommand/add',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsWriteMethods)),
            ...(fetchMiddlewares<RequestHandler>(SystemLogsWriteMethods.prototype.addSystemCommandLog)),

            function SystemLogsWriteMethods_addSystemCommandLog(request: any, response: any, next: any) {
            const args = {
                    accessToken: {"in":"query","name":"accessToken","required":true,"dataType":"string"},
                    logContent: {"in":"body-prop","name":"logContent","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SystemLogsWriteMethods();


              const promise = controller.addSystemCommandLog.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/login',
            ...(fetchMiddlewares<RequestHandler>(SecurityMethods)),
            ...(fetchMiddlewares<RequestHandler>(SecurityMethods.prototype.login)),

            function SecurityMethods_login(request: any, response: any, next: any) {
            const args = {
                    email: {"in":"body-prop","name":"email","required":true,"dataType":"string"},
                    password: {"in":"body-prop","name":"password","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SecurityMethods();


              const promise = controller.login.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, _response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await promiseAny(secMethodOrPromises);
                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
