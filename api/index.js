var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define("src/constants.config", [], {
    "timezone": "utc",
    "schemaName": "lida",
    "apiPath": "api/v1",
    "test": {
        "setupThrowsError": true,
        "account": {
            "email": "doanquoctrungvn@gmail.com",
            "password": "123456789"
        }
    },
    "compression": {
        "fileExtension": "zip"
    },
    "limit": {
        "logLines": 100,
        "sensor": 100,
        "actuator": 100
    },
    "componentPath": {
        "sensor": "sensors",
        "sensorData": "sensorData",
        "actuator": "actuators",
        "actuatorConfig": "actuatorConfig",
        "actuatorConfigProposed": "actuatorConfigProposed",
        "systemCommand": "systemCommand/flags",
        "systemCommandProposed": "systemCommand/flags",
        "logs": {
            "sensor": "logs/sensor",
            "actuator": "logs/actuator",
            "systemCommand": "logs/systemCommand"
        },
        "storage": {
            "sensor": "sensor",
            "log": "log"
        },
        "count": {
            "run": "count/run",
            "path": "count"
        }
    },
    "firebase": {
        "storage": {
            "development": {
                "realtimeUrl": "development/query",
                "storageFolder": "snapshots/development",
                "firestoreDocPath": "lida/development"
            },
            "production": {
                "realtimeUrl": "production/query",
                "storageFolder": "snapshots/production",
                "firestoreDocPath": "lida/production"
            },
            "test": {
                "realtimeUrl": "test/query",
                "storageFolder": "snapshots/test",
                "firestoreDocPath": "lida/test"
            }
        }
    },
    "logger": {
        "level": "info",
        "levels": {
            "critical": 0,
            "error": 1,
            "warn": 2,
            "info": 3,
            "debug": 4,
            "trace": 5,
            "silly": 6
        },
        "defaultMeta": {
            "service": "user-service"
        },
        "transport": {
            "errorLog": {
                "filename": "error.log",
                "level": "error",
                "maxsize": 52428800,
                "maxFiles": 1
            },
            "infoLog": {
                "filename": "info.log",
                "level": "info",
                "maxsize": 52428800,
                "maxFiles": 2
            },
            "debugLog": {
                "filename": "debug.log",
                "level": "debug",
                "maxsize": 52428800,
                "maxFiles": 4
            }
        }
    }
});
define("src/constants", ["require", "exports", "winston", "src/constants.config"], function (require, exports, winston_1, constants_config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SERVICE_ACCOUNT_CREDENTIALS = exports.FIREBASE_CONFIG = exports.CIPHER_ALGORITHM = exports.RAW_CIPHER_IV = exports.RAW_CIPHER_KEY = exports.SESSION_SECRET = exports.COOKIE_SECRET = exports.COMPONENTS_PATH = exports.TEST_ACCOUNT = exports.TEST_SETUP_THROWS_ERROR = exports.COMPRESSION_SETTINGS = exports.PROMISE_CATCH_METHOD = exports.ACTUATOR_LIMIT = exports.SENSOR_LIMIT = exports.LOG_LINES = exports.DATABASE_TIMEZONE = exports.schemaName = exports.firebasePathConfig = exports.logger = exports.dbConnection = void 0;
    winston_1 = __importDefault(winston_1);
    constants_config_json_1 = __importDefault(constants_config_json_1);
    (() => {
        require('dotenv').config({ path: `${__dirname}/../.env` });
    })();
    exports.dbConnection = (() => {
        return {
            databaseUrl: process.env.DATABASE_URL,
            ssl: process.env.SSL_PARAM == undefined ? { rejectUnauthorized: false } : !!+process.env.SSL_PARAM
        };
    })();
    exports.logger = winston_1.default.createLogger({
        level: constants_config_json_1.default.logger.level,
        levels: constants_config_json_1.default.logger.levels,
        format: winston_1.default.format.json(),
        defaultMeta: constants_config_json_1.default.logger.defaultMeta,
        transports: (() => {
            if (process.env.NODE_ENV === 'production')
                return [
                    new winston_1.default.transports.Console({
                        level: "info",
                        format: winston_1.default.format.combine(winston_1.default.format.prettyPrint({ colorize: true }), winston_1.default.format.simple()),
                    })
                ];
            return [
                new winston_1.default.transports.File(constants_config_json_1.default.logger.transport.errorLog),
                new winston_1.default.transports.File(constants_config_json_1.default.logger.transport.debugLog),
            ];
        })(),
    });
    exports.firebasePathConfig = (() => {
        if (process.env.NODE_ENV === 'test')
            return constants_config_json_1.default.firebase.storage.test;
        if (process.env.NODE_ENV === 'production')
            return constants_config_json_1.default.firebase.storage.production;
        if (process.env.NODE_ENV === 'development')
            return constants_config_json_1.default.firebase.storage.development;
        return constants_config_json_1.default.firebase.storage.test;
    })();
    exports.schemaName = constants_config_json_1.default.schemaName;
    exports.DATABASE_TIMEZONE = constants_config_json_1.default.timezone || "Australia/Melbourne";
    exports.LOG_LINES = constants_config_json_1.default.limit.logLines;
    exports.SENSOR_LIMIT = constants_config_json_1.default.limit.sensor;
    exports.ACTUATOR_LIMIT = constants_config_json_1.default.limit.actuator;
    const PROMISE_CATCH_METHOD = (reason) => {
        exports.logger.error(reason);
        if (process.env.NODE_ENV !== 'production')
            return reason;
    };
    exports.PROMISE_CATCH_METHOD = PROMISE_CATCH_METHOD;
    exports.COMPRESSION_SETTINGS = constants_config_json_1.default.compression;
    exports.TEST_SETUP_THROWS_ERROR = constants_config_json_1.default.test.setupThrowsError;
    exports.TEST_ACCOUNT = constants_config_json_1.default.test.account;
    exports.COMPONENTS_PATH = constants_config_json_1.default.componentPath;
    exports.COOKIE_SECRET = process.env.SECRET_COOKIESECRET;
    exports.SESSION_SECRET = process.env.SECRET_SESSIONSECRET;
    exports.RAW_CIPHER_KEY = Buffer.from(process.env.SECRET_CIPHERKEY, "base64");
    exports.RAW_CIPHER_IV = Buffer.from(process.env.SECRET_CIPHERIV, "base64");
    exports.CIPHER_ALGORITHM = process.env.SECRET_CIPHERALGORITHM;
    exports.FIREBASE_CONFIG = {
        apiKey: process.env.SECRET_FIREBASECONFIG_APIKEY,
        authDomain: process.env.SECRET_FIREBASECONFIG_AUTHDOMAIN,
        databaseURL: process.env.SECRET_FIREBASECONFIG_DATABASEURL,
        projectId: process.env.SECRET_FIREBASECONFIG_PROJECTID,
        storageBucket: process.env.SECRET_FIREBASECONFIG_STORAGEBUCKET,
        messagingSenderId: process.env.SECRET_FIREBASECONFIG_MESSAGINGSENDERID,
        appId: process.env.SECRET_FIREBASECONFIG_APPID
    };
    exports.SERVICE_ACCOUNT_CREDENTIALS = {
        type: process.env.SERVICEACCOUNTKEY_TYPE,
        project_id: process.env.SERVICEACCOUNTKEY_PROJECT_ID,
        private_key_id: process.env.SERVICEACCOUNTKEY_PRIVATE_KEY_ID,
        private_key: JSON.parse(process.env.SERVICEACCOUNTKEY_PRIVATE_KEY),
        client_email: process.env.SERVICEACCOUNTKEY_CLIENT_EMAIL,
        client_id: process.env.SERVICEACCOUNTKEY_CLIENT_ID,
        auth_uri: process.env.SERVICEACCOUNTKEY_AUTH_URI,
        token_uri: process.env.SERVICEACCOUNTKEY_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.SERVICEACCOUNTKEY_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.SERVICEACCOUNTKEY_CLIENT_X509_CERT_URL
    };
});
define("src/model/json", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JsonConvertible = void 0;
    class JsonConvertible {
        toJson() { return {}; }
        static fromJson(json) { return new JsonConvertible(); }
    }
    exports.JsonConvertible = JsonConvertible;
});
define("src/model/v1/write/actuators", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/model/v1/read/actuatorDto", ["require", "exports", "luxon", "src/constants"], function (require, exports, luxon_1, constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActuatorConfigDTO = exports.ActuatorConfigType = exports.ActuatorDTO = void 0;
    class ActuatorDTO {
        constructor(name, type, isRunning) {
            this.name = name;
            this.type = type;
            this.isRunning = isRunning;
        }
        toJson() {
            return {
                name: this.name,
                type: this.type,
                isRunning: this.isRunning
            };
        }
        static fromJson(actuatorJson) {
            return new ActuatorDTO(typeof (actuatorJson.name) === 'string' ? actuatorJson.name : "", typeof (actuatorJson.type) === 'string' ? actuatorJson.type : "", typeof (actuatorJson.isRunning) === 'boolean' ? actuatorJson.isRunning : true);
        }
    }
    exports.ActuatorDTO = ActuatorDTO;
    var ActuatorConfigType;
    (function (ActuatorConfigType) {
        ActuatorConfigType[ActuatorConfigType["TOGGLE"] = 0] = "TOGGLE";
        ActuatorConfigType[ActuatorConfigType["MOTOR"] = 1] = "MOTOR";
        ActuatorConfigType[ActuatorConfigType["NONE"] = 2] = "NONE";
    })(ActuatorConfigType = exports.ActuatorConfigType || (exports.ActuatorConfigType = {}));
    class ActuatorConfigDTO {
        constructor(actuatorName, timeStamp, timesPerDay, toggleConfig, motorConfig) {
            this.actuatorName = actuatorName;
            this.timeStamp = timeStamp;
            this.toggleConfig = toggleConfig;
            this.motorConfig = motorConfig;
            this.timesPerDay = timesPerDay;
            if ((timesPerDay === 0 || !motorConfig) && toggleConfig)
                this.type = ActuatorConfigType.TOGGLE;
            else if (!toggleConfig && timesPerDay > 0 && motorConfig)
                this.type = ActuatorConfigType.MOTOR;
            else
                this.type = ActuatorConfigType.NONE;
        }
        toJson() {
            const json = {
                actuatorName: this.actuatorName,
                timeStamp: this.timeStamp,
                timesPerDay: this.timesPerDay,
                type: this.type
            };
            if (!this.motorConfig)
                json.toggleConfig = this.toggleConfig;
            if (!this.toggleConfig)
                json.motorConfig = this.motorConfig;
            return json;
        }
        static fromJson(actuatorJson) {
            const unixNow = luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger();
            return new ActuatorConfigDTO(typeof (actuatorJson.actuatorName) === 'string' ? actuatorJson.actuatorName : "", typeof (actuatorJson.timeStamp) === 'number' ? actuatorJson.timeStamp : unixNow, typeof (actuatorJson.timesPerDay) === 'number' ? actuatorJson.timesPerDay : 0, typeof (actuatorJson.toggleConfig) === 'object' ? actuatorJson.toggleConfig : null, typeof (actuatorJson.motorConfig) === 'object' ? actuatorJson.motorConfig : null);
        }
    }
    exports.ActuatorConfigDTO = ActuatorConfigDTO;
});
define("src/model/v1/events/databaseEvent", ["require", "exports", "luxon", "src/constants"], function (require, exports, luxon_2, constants_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DatabaseEvent {
        constructor(report) {
            const now = luxon_2.DateTime.now().setZone(constants_2.DATABASE_TIMEZONE);
            this.content = Object.assign(Object.assign({}, report), { timeStamp: now.toUnixInteger(), isoTimeStamp: now.toISO(), normalTimeStamp: now.toLocaleString(luxon_2.DateTime.DATETIME_FULL_WITH_SECONDS) });
        }
        static getCompactEvent(event) {
            const values = event.content.values;
            delete values.protected;
            return new DatabaseEvent({
                type: event.content.type,
                info: event.content.info,
                error: event.content.error,
                warning: event.content.warning,
                values: values
            });
        }
    }
    exports.default = DatabaseEvent;
});
define("src/model/patterns/subscription", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/model/patterns/subscriptionImplementor", ["require", "exports", "src/constants"], function (require, exports, constants_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubscriberImplementor = exports.PublisherImplementor = void 0;
    class PublisherImplementor {
        constructor() {
            this.subscribers = [];
        }
        addSubscriber(subscriber) {
            if (this.subscribers.indexOf(subscriber) == -1) {
                this.subscribers.push(subscriber);
                constants_3.logger.debug(`Added a subscriber to ${this.constructor.name}`);
            }
        }
        notify(newItem) {
            this.subscribers.map(sub => sub.onNext(newItem));
        }
        notifyAsync(newItem) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = [];
                for (const sub of this.subscribers) {
                    result.push(yield sub.onNextAsync(newItem));
                }
                return result;
            });
        }
        sendError(error) {
            this.subscribers.map(sub => sub.onError(error));
            constants_3.logger.error(`An error occurred in ${this.constructor.name} and`
                + ` it is sent to all subscribers with following message: ${error}`);
        }
        end() {
            this.subscribers.map(sub => sub.onFinished());
            constants_3.logger.debug(`Ended pipe/connection to subscribers from ${this.constructor.name}`);
        }
        removeSubscriber(subscriber) {
            this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
            constants_3.logger.debug(`Trying to remove a subscriber from ${this.constructor.name}`);
        }
    }
    exports.PublisherImplementor = PublisherImplementor;
    class SubscriberImplementor {
        get event() { return this._event; }
        subscribe(publisher) {
            if (this.unsubscriber !== publisher) {
                this.unsubscriber = publisher;
                publisher.addSubscriber(this);
                constants_3.logger.debug(`${this.constructor.name} subscribed to a publisher named ${publisher.constructor.name}`);
            }
        }
        onNext(event) {
            this._event = event;
            constants_3.logger.debug(`An event is propagated to ${this.constructor.name}`);
        }
        onError(error) {
            constants_3.logger.error(`An error occurred in ${this.constructor.name} with following message: ${error}`);
        }
        onFinished() { this.unsubscribe(); }
        unsubscribe() {
            var _a, _b, _c;
            const name = (_b = (_a = this.unsubscriber) === null || _a === void 0 ? void 0 : _a.constructor.name) !== null && _b !== void 0 ? _b : "null";
            (_c = this.unsubscriber) === null || _c === void 0 ? void 0 : _c.removeSubscriber(this);
            this.unsubscriber = null;
            constants_3.logger.debug(`${this.constructor.name} unsubscribed to its publisher named ${name}`);
        }
    }
    exports.SubscriberImplementor = SubscriberImplementor;
});
define("src/model/v1/events/databaseAddEvent", ["require", "exports", "src/constants", "src/model/v1/events/databaseEvent"], function (require, exports, constants_4, databaseEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseEvent_1 = __importDefault(databaseEvent_1);
    class DatabaseAddEvent extends databaseEvent_1.default {
        constructor(values) {
            super({
                type: "Ok",
                info: "An add event has been created. Committing changes to the database...",
                error: "",
                warning: "",
                values
            });
            constants_4.logger.info("A DatabaseAddEvent is created!");
        }
    }
    exports.default = DatabaseAddEvent;
});
define("src/model/v1/events/databaseUpdateEvent", ["require", "exports", "src/constants", "src/model/v1/events/databaseEvent"], function (require, exports, constants_5, databaseEvent_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseEvent_2 = __importDefault(databaseEvent_2);
    class DatabaseUpdateEvent extends databaseEvent_2.default {
        constructor(values) {
            super({
                type: "Ok",
                info: "An update event has been created. Committing changes to the database...",
                error: "",
                warning: "",
                values
            });
            constants_5.logger.info("A DatabaseUpdateEvent is created!");
        }
    }
    exports.default = DatabaseUpdateEvent;
});
define("src/controller/database/firebase/interfaces/firebaseStorageFacade", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/controller/database/firebase/services/firebaseStorageService", ["require", "exports", "firebase-admin", "src/constants"], function (require, exports, firebase_admin_1, constants_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    firebase_admin_1 = __importDefault(firebase_admin_1);
    function retry(callback, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options.maxRetries = (options === null || options === void 0 ? void 0 : options.maxRetries) || 10;
            options.maxResponseTime = (options === null || options === void 0 ? void 0 : options.maxResponseTime) || 100;
            if (options.maxRetries == 0)
                return Promise.reject("Max retries reached while failing to verify source data");
            return callback().catch(() => retry(callback, Object.assign({ maxRetries: options.maxRetries - 1 }, options)));
        });
    }
    class FirebaseStorageService {
        constructor(firebaseApp, rootFolder) {
            this.bucket = firebase_admin_1.default.storage(firebaseApp).bucket();
            this.rootFolder = rootFolder || "";
            this.encoding = "utf-8";
        }
        get path() {
            return this.rootFolder && this.currentName ?
                `${this.rootFolder}/${this.currentName}` : this.rootFolder || this.currentName;
        }
        changeEncoding(encoding) {
            this.encoding = encoding;
            return this;
        }
        isFileExists(name) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentName = name;
                return this.bucket.file(this.path).exists()
                    .then(res => {
                    constants_6.logger.info(`Storage service: File "${this.path}" ${res[0] ? "exists" : "does not exists"}`);
                    return res[0];
                }).catch(constants_6.PROMISE_CATCH_METHOD);
            });
        }
        readFileFromStorage(name) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentName = name;
                return this.bucket.file(this.path).download()
                    .then(res => (constants_6.logger.info(`Storage service: Downloaded file: ${this.path}`), res[0]))
                    .catch(constants_6.PROMISE_CATCH_METHOD);
            });
        }
        readFolderFromStorage(folderName, options) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentName = folderName;
                return yield this.bucket.getFiles(Object.assign({ prefix: this.path }, options))
                    .then(res => (constants_6.logger.info(`Storage service: Got response from folder in the storage: ${this.path}`), res))
                    .catch(constants_6.PROMISE_CATCH_METHOD);
            });
        }
        uploadBytesToStorage(name, content, options) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentName = name;
                if (typeof (content) === 'string')
                    content = Buffer.from(content).toString(this.encoding);
                return this.bucket.file(this.path).save(content, options)
                    .then(res => {
                    constants_6.logger.info(`Storage service: Uploaded file named ${this.path} to the bucket with response: ${res}`);
                    return res;
                })
                    .catch(constants_6.PROMISE_CATCH_METHOD);
            });
        }
        appendBytesToFile(name, content, options) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentName = name;
                return retry(() => __awaiter(this, void 0, void 0, function* () {
                    const file = this.bucket.file(this.path);
                    if ((yield file.exists())[0])
                        return;
                    const initialHash = (yield file.getMetadata())[0].md5Hash;
                    const [oldContent] = yield file.download();
                    if (typeof (content) !== 'string')
                        content = content.toString(this.encoding);
                    oldContent.write(content, this.encoding);
                    if (initialHash != (yield file.getMetadata())[0].md5Hash)
                        return Promise.reject();
                    return file.save(oldContent, options)
                        .then(res => {
                        constants_6.logger.info(`Storage service: Uploaded file named ${this.path} to the bucket with response: ${res}`);
                        return res;
                    });
                })).catch(constants_6.PROMISE_CATCH_METHOD);
            });
        }
        deleteFileFromStorage(name) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentName = name;
                return yield this.bucket.file(this.path).delete({ ignoreNotFound: true })
                    .then(res => (constants_6.logger.info(`Storage service: Deleted file named ${name}`), res))
                    .catch(constants_6.PROMISE_CATCH_METHOD);
            });
        }
        deleteFolderFromStorage(folderName) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentName = folderName;
                yield this.bucket.deleteFiles({ prefix: this.path })
                    .then(res => (constants_6.logger.info(`Storage service: Deleted folder with directory of ${folderName}`), res))
                    .catch(constants_6.PROMISE_CATCH_METHOD);
            });
        }
    }
    exports.default = FirebaseStorageService;
});
define("src/controller/database/firebase/interfaces/firebaseRealtimeFacade", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/utility/updateObject", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function updateObject(oldObject, replacement) {
        for (const key in oldObject) {
            if (!(key in replacement))
                continue;
            if (typeof (oldObject[key]) === 'object' && typeof (replacement[key]) === 'object') {
                updateObject(oldObject[key], replacement[key]);
                continue;
            }
            oldObject[key] = replacement[key];
        }
        return oldObject;
    }
    exports.default = updateObject;
});
define("src/model/patterns/option", ["require", "exports", "src/constants"], function (require, exports, constants_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.None = exports.Some = void 0;
    class NormalOption {
        constructor(value) {
            this.match = {
                isOk() { return true; },
                isNone() { return false; }
            };
            this.value = value;
        }
        expect(_) { return this.value; }
        unwrapOr(_) { return this.value; }
        unwrapOrElse(_) { return this.value; }
        unwrapOrElseAsync(_) {
            return __awaiter(this, void 0, void 0, function* () { return this.value; });
        }
        map(callback) { return callback(this.value); }
        toString() { return `[object Some(${this.value.toString()})]`; }
    }
    class EmptyOption {
        constructor() {
            this.match = {
                isOk() { return false; },
                isNone() { return true; }
            };
        }
        expect(message, errorCtor) {
            constants_7.logger.error(`A None option was passed and expected. Error message: ${message}`);
            if (errorCtor)
                throw new errorCtor(message);
            throw new Error(message);
        }
        unwrapOr(defaultValue) { return defaultValue; }
        unwrapOrElse(callback) { return callback(); }
        unwrapOrElseAsync(asyncCallback) {
            return __awaiter(this, void 0, void 0, function* () {
                if (asyncCallback)
                    return yield asyncCallback();
                throw new TypeError("Unwrap callback must present");
            });
        }
        map(_) { return exports.None; }
        toString() { return "[object None]"; }
    }
    function Some(val) { return new NormalOption(val); }
    exports.Some = Some;
    exports.None = new EmptyOption();
});
define("src/controller/database/firebase/services/firebaseRealtimeService", ["require", "exports", "firebase-admin", "src/constants", "src/utility/updateObject", "src/model/patterns/option"], function (require, exports, firebase_admin_2, constants_8, updateObject_1, option_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getQueryResultAsArray = exports.getQueryResult = void 0;
    firebase_admin_2 = __importDefault(firebase_admin_2);
    updateObject_1 = __importDefault(updateObject_1);
    function getQueryResult(query, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {};
            yield query.once('child_added', child => {
                const data = child.val();
                if (!filter || filter(data))
                    result[child.key] = data;
            });
            constants_8.logger.info(`Result of query that is sorted by child at ${query.ref.key}: ${result}`);
            return result;
        });
    }
    exports.getQueryResult = getQueryResult;
    function getQueryResultAsArray(query, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultArr = [];
            yield query.once('value', snapshot => {
                if (!snapshot.exists()) {
                    constants_8.logger.warn("Snapshot does not exist with a value of " + snapshot.val());
                    return;
                }
                snapshot.forEach(child => {
                    const data = child.val();
                    if (!filter || filter(data))
                        resultArr.push(data);
                });
            });
            constants_8.logger.info(`Result of query that is sorted by child at ${query.ref.key}: ${resultArr}`);
            return resultArr.length == 0 ? option_1.None : (0, option_1.Some)(resultArr);
        });
    }
    exports.getQueryResultAsArray = getQueryResultAsArray;
    const logError = (err, onComplete) => (err && constants_8.logger.error(err), onComplete);
    class FirebaseRealtimeService {
        constructor(firebaseApp, basePath) {
            this.database = firebase_admin_2.default.database(firebaseApp);
            this.rootRef = this.database.ref(basePath);
        }
        changeRootReference(basePath) {
            this.rootRef = this.database.ref(basePath);
            return this;
        }
        getContent(path, queryCallback) {
            return __awaiter(this, void 0, void 0, function* () {
                const ref = path ? this.rootRef.child(path) : this.rootRef;
                return (queryCallback ? queryCallback(ref) : ref.get())
                    .then(snapshot => (constants_8.logger.info(`Realtime database service: Got realtime data from ${path}`), snapshot))
                    .catch(constants_8.PROMISE_CATCH_METHOD);
            });
        }
        pushContent(content, path, onComplete) {
            return (path ? this.rootRef.child(path) : this.rootRef)
                .push(content, err => {
                if (!err)
                    constants_8.logger.info(`Realtime database service: Pushed content at ${path} for realtime database`);
                logError(err, onComplete);
            });
        }
        setContent(content, path, onComplete) {
            return __awaiter(this, void 0, void 0, function* () {
                return (path ? this.rootRef.child(path) : this.rootRef)
                    .transaction(_ => content, err => {
                    if (!err)
                        constants_8.logger.info(`Realtime database service: Set content at ${path} for realtime database`);
                    logError(err, onComplete);
                });
            });
        }
        updateContent(content, path, onComplete) {
            return __awaiter(this, void 0, void 0, function* () {
                return (path ? this.rootRef.child(path) : this.rootRef)
                    .transaction(oldContent => (0, updateObject_1.default)(oldContent, content), err => {
                    if (!err)
                        constants_8.logger.info(`Realtime database service: Updated content at ${path} for realtime database`);
                    logError(err, onComplete);
                });
            });
        }
        deleteContent(path, onComplete) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.rootRef.child(path)
                    .transaction(_ => null, err => {
                    if (!err)
                        constants_8.logger.info(`Realtime database service: Deleted content at ${path} for realtime database`);
                    logError(err, onComplete);
                });
            });
        }
        runTransaction(transaction, path, onComplete, applyLocally) {
            return __awaiter(this, void 0, void 0, function* () {
                return (path ? this.rootRef.child(path) : this.rootRef)
                    .transaction(a => transaction(a), (err, b, c) => {
                    if (!err)
                        constants_8.logger.info(`Realtime database service: Ran transaction at ${path} for realtime database`);
                    err && constants_8.logger.error(err);
                    onComplete && onComplete(err, b, c);
                }, applyLocally);
            });
        }
    }
    exports.default = FirebaseRealtimeService;
});
define("src/controller/database/firebase/interfaces/firebaseFirestoreFacade", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/controller/database/firebase/services/firebaseFirestoreService", ["require", "exports", "firebase-admin", "src/constants"], function (require, exports, firebase_admin_3, constants_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    firebase_admin_3 = __importDefault(firebase_admin_3);
    class FirebaseFirestoreService {
        constructor(firebaseApp, rootDocPath) {
            this.firestore = firebase_admin_3.default.firestore(firebaseApp);
            this.rootDoc = rootDocPath ? this.firestore.doc(rootDocPath) : null;
        }
        get path() {
            return this.rootDoc && this.currentDocPath ?
                `${this.rootDoc.path}/${this.currentDocPath}` : (this.currentDocPath || this.rootDoc.path);
        }
        getCollection(collectionPath) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                return ((_a = this.rootDoc) !== null && _a !== void 0 ? _a : this.firestore).collection(collectionPath).get()
                    .then(snapshot => {
                    constants_9.logger.info(`Firestore service: Got collection at ${snapshot.empty && snapshot.docs[0].ref.parent.path}`);
                    return snapshot;
                })
                    .catch(constants_9.PROMISE_CATCH_METHOD);
            });
        }
        queryCollection(collectionPath, callback) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                return callback(((_a = this.rootDoc) !== null && _a !== void 0 ? _a : this.firestore).collection(collectionPath))
                    .then(snapshot => {
                    constants_9.logger.info(`Firestore service: Got collection at ${!snapshot.empty && snapshot.docs[0].ref.parent.path}`);
                    return snapshot;
                })
                    .catch(constants_9.PROMISE_CATCH_METHOD);
            });
        }
        addContentToCollection(collectionPath, content, parentDocument) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                return ((_a = parentDocument !== null && parentDocument !== void 0 ? parentDocument : this.rootDoc) !== null && _a !== void 0 ? _a : this.firestore).collection(collectionPath).add(content)
                    .then(ref => (constants_9.logger.info(`Firestore service: Created new document at ${ref.path}`), ref))
                    .catch(constants_9.PROMISE_CATCH_METHOD);
            });
        }
        getDocument(documentPath) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentDocPath = documentPath;
                return this.firestore.doc(this.path).get()
                    .then(snapshot => (constants_9.logger.info(`Firestore service: Got document at ${this.path}`), snapshot))
                    .catch(constants_9.PROMISE_CATCH_METHOD);
            });
        }
        createDocument(documentPath, content) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentDocPath = documentPath;
                return this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const currentDoc = yield t.get(this.firestore.doc(this.path));
                    t.create(currentDoc.ref, content);
                })).then(res => (constants_9.logger.info(`Firestore service: Created document at ${this.path}`), res))
                    .catch(constants_9.PROMISE_CATCH_METHOD);
            });
        }
        setDocument(documentPath, content) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentDocPath = documentPath;
                return this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const currentDoc = yield t.get(this.firestore.doc(this.path));
                    t.set(currentDoc.ref, content);
                })).then(res => (constants_9.logger.info(`Firestore service: Set document at ${this.path}`), res))
                    .catch(constants_9.PROMISE_CATCH_METHOD);
            });
        }
        updateDocument(documentPath, content, precondition) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentDocPath = documentPath;
                return this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const currentDoc = yield t.get(this.firestore.doc(this.path));
                    t.update(currentDoc.ref, content, precondition);
                })).then(res => (constants_9.logger.info(`Firestore service: Updated document at ${this.path}`), res))
                    .catch(constants_9.PROMISE_CATCH_METHOD);
            });
        }
        deleteDocument(documentPath, precondition) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentDocPath = documentPath;
                return this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const currentDoc = yield t.get(this.firestore.doc(this.path));
                    t.delete(currentDoc.ref, precondition);
                })).then(res => (constants_9.logger.info(`Firestore service: Deleted document at ${this.path}`), res))
                    .catch(constants_9.PROMISE_CATCH_METHOD);
            });
        }
        deleteCollection(collectionPath) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const path = `${(_a = this.rootDoc) === null || _a === void 0 ? void 0 : _a.path}/${collectionPath}`;
                const collection = yield this.firestore.collection(path).get();
                for (const doc of collection.docs)
                    yield this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () { return t.delete(doc.ref); }))
                        .catch(reason => reason && constants_9.logger.error(reason));
            });
        }
        runTransaction(documentPath, transaction) {
            return __awaiter(this, void 0, void 0, function* () {
                this.currentDocPath = documentPath;
                return yield this.firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const currentDoc = yield t.get(this.firestore.doc(this.path));
                    return yield transaction(currentDoc, t);
                })).then(res => (constants_9.logger.info(`Firestore service: Ran custom transaction at ${this.path}`), res))
                    .catch(constants_9.PROMISE_CATCH_METHOD);
            });
        }
    }
    exports.default = FirebaseFirestoreService;
});
define("src/model/v1/auth/user", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class User {
        constructor(userData, accessToken) {
            this.displayName = userData.displayName;
            this.email = userData.email;
            this.emailVerified = userData.emailVerified;
            this.phoneNumber = userData.phoneNumber;
            this.photoURL = userData.photoURL;
            this.isLoggedOut = false;
            this.accessToken = accessToken.toString('hex');
        }
        logOut() { this.isLoggedOut = true; }
        toUpdateRequest() {
            return {
                email: this.email,
                emailVerified: this.emailVerified,
                displayName: this.displayName,
                phoneNumber: this.phoneNumber,
                photoURL: this.photoURL
            };
        }
    }
    exports.default = User;
});
define("src/controller/database/firebase/interfaces/firebaseAuthFacade", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/utility/encryption", ["require", "exports", "crypto", "src/constants"], function (require, exports, crypto_1, constants_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.asymmetricKeyDecryption = exports.asymmetricKeyEncryption = void 0;
    let authTag = null;
    function asymmetricKeyEncryption(data) {
        const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", constants_10.RAW_CIPHER_KEY, constants_10.RAW_CIPHER_IV);
        const buffer = Buffer.concat([cipher.update(data), cipher.final()]);
        authTag = cipher.getAuthTag();
        return buffer;
    }
    exports.asymmetricKeyEncryption = asymmetricKeyEncryption;
    function asymmetricKeyDecryption(data) {
        const decipher = (0, crypto_1.createDecipheriv)("aes-256-gcm", constants_10.RAW_CIPHER_KEY, constants_10.RAW_CIPHER_IV);
        if (!authTag) {
            const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", constants_10.RAW_CIPHER_KEY, constants_10.RAW_CIPHER_IV);
            cipher.final();
            authTag = cipher.getAuthTag();
        }
        decipher.setAuthTag(authTag);
        return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf-8');
    }
    exports.asymmetricKeyDecryption = asymmetricKeyDecryption;
});
define("src/controller/database/firebase/services/firebaseAuthService", ["require", "exports", "firebase-admin", "firebase/app", "firebase/auth", "src/constants", "src/model/v1/auth/user", "luxon", "crypto", "src/utility/encryption"], function (require, exports, firebase_admin_4, app_1, auth_1, constants_11, user_1, luxon_3, crypto_2, encryption_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    firebase_admin_4 = __importDefault(firebase_admin_4);
    user_1 = __importDefault(user_1);
    class APIKey {
        constructor(storage, priviledge = "admin") {
            this.storage = storage;
            this.priviledge = priviledge;
        }
        getAuthFilePath(email) { return `auth/user/${email}/api_key.json`; }
        getKey(uid, renewalRetries = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                const path = this.getAuthFilePath(uid);
                if (!(yield this.storage.isFileExists(path))) {
                    if (renewalRetries === 3)
                        return "";
                    yield this.renewKey(uid);
                    return this.getKey(uid, renewalRetries + 1);
                }
                const data = (yield this.storage.readFileFromStorage(path)).toString();
                constants_11.logger.info("APIKey - getKey: " + data);
                if (!data)
                    return "";
                const json = JSON.parse(data);
                if (!json || !json[this.priviledge])
                    return "";
                const keyInfo = json[this.priviledge];
                if (keyInfo.expiraryDate <= luxon_3.DateTime.now().setZone(constants_11.DATABASE_TIMEZONE).toUnixInteger())
                    return "";
                return keyInfo.apiKey;
            });
        }
        validateKey(uid, apiKey) {
            return __awaiter(this, void 0, void 0, function* () {
                const storedAPIKey = yield this.getKey(uid);
                constants_11.logger.warn("FirebaseAuthService - validateKey: Stored API key" + storedAPIKey);
                return storedAPIKey === apiKey;
            });
        }
        renewKey(uid, expiraryDateFromNow = 3600 * 24 * 30) {
            return __awaiter(this, void 0, void 0, function* () {
                const apiKey = (0, crypto_2.randomBytes)(64).toString("base64");
                const data = ((yield this.storage.isFileExists(this.getAuthFilePath(uid))) &&
                    (yield this.storage.readFileFromStorage(this.getAuthFilePath(uid))).toString()) || "{}";
                const json = JSON.parse(data);
                json[this.priviledge] = {
                    expirary: luxon_3.DateTime.now().setZone(constants_11.DATABASE_TIMEZONE).toUnixInteger() + expiraryDateFromNow,
                    apiKey
                };
                constants_11.logger.debug("FirebaseAuthService - reauth: " + JSON.stringify(json));
                return yield this.storage.uploadBytesToStorage(this.getAuthFilePath(uid), JSON.stringify(json))
                    .then(() => apiKey, () => "");
            });
        }
    }
    class FirebaseAuthService {
        constructor(firebaseApp, storageFacade) {
            this.clientAuth = (0, auth_1.getAuth)((0, app_1.initializeApp)(constants_11.FIREBASE_CONFIG, Array(10).fill(0).map(_ => String.fromCharCode((0, crypto_2.randomInt)(65, 90))).join('')));
            this.adminAuth = firebase_admin_4.default.auth(firebaseApp);
            this.storage = storageFacade;
        }
        loginWithEmail(email, password) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, auth_1.signInWithEmailAndPassword)(this.clientAuth, email, password)
                    .then((credentials) => __awaiter(this, void 0, void 0, function* () {
                    const apiKeyObj = new APIKey(this.storage, "admin");
                    let apiKey = yield apiKeyObj.getKey(credentials.user.uid);
                    try {
                        (0, encryption_1.asymmetricKeyDecryption)(Buffer.from(apiKey, 'hex'));
                    }
                    catch (e) {
                        apiKey = yield apiKeyObj.renewKey(credentials.user.uid);
                    }
                    constants_11.logger.info("FirebaseAuthService - loginWithEmail: New user logged in!");
                    let accessToken = null;
                    if (apiKey) {
                        accessToken = (0, encryption_1.asymmetricKeyEncryption)(`${credentials.user.uid}|${apiKey}`);
                        return new user_1.default(credentials.user, accessToken);
                    }
                    return Promise.reject({
                        message: "Authentication failed",
                        reason: "Could not regenerate new API key"
                    });
                }));
            });
        }
        loginWithProvider() {
            return __awaiter(this, void 0, void 0, function* () { return null; });
        }
        registerWithEmail(email, password, redirectUrl) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.adminAuth.createUser({
                    email,
                    password,
                    displayName: (0, crypto_2.randomBytes)(15).toString("base64")
                }).then((record) => __awaiter(this, void 0, void 0, function* () {
                    const apiKey = new APIKey(this.storage, "admin");
                    yield apiKey.renewKey(record.uid);
                    constants_11.logger.info("FirebaseAuthService - registerWithEmail: New user is registered");
                }))
                    .catch(constants_11.PROMISE_CATCH_METHOD);
            });
        }
        reauthenticationWithEmail(email, password) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, auth_1.signInWithEmailAndPassword)(this.clientAuth, email, password)
                    .then((credentials) => __awaiter(this, void 0, void 0, function* () {
                    const apiKey = yield new APIKey(this.storage, "admin").renewKey(credentials.user.uid);
                    constants_11.logger.info("FirebaseAuthService - reauthenticationWithEmail: New user logged in!");
                    let accessToken = null;
                    if (apiKey) {
                        accessToken = (0, encryption_1.asymmetricKeyEncryption)(`${credentials.user.uid}|${apiKey}`);
                        return new user_1.default(credentials.user, accessToken);
                    }
                    return Promise.reject({
                        message: "Reauthentication failed",
                        reason: "Could not regenerate new API key"
                    });
                }));
            });
        }
        verifyApiKey(uid, apiKey) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_11.logger.debug("FirebaseAuthService: Verifying API key");
                return new APIKey(this.storage, "admin").validateKey(uid, apiKey);
            });
        }
        updatePassword(user, newPassword) {
            return __awaiter(this, void 0, void 0, function* () {
            });
        }
        forgotPassword() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
        updateUser(user) {
            return __awaiter(this, void 0, void 0, function* () {
                return null;
            });
        }
        deleteUser(uid, apiKey) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = new APIKey(this.storage, "admin");
                if (!(yield key.validateKey(uid, apiKey)))
                    return;
                yield this.adminAuth.deleteUser(uid)
                    .then(() => constants_11.logger.info(`User with uid ${uid} is deleted`))
                    .catch(constants_11.PROMISE_CATCH_METHOD);
            });
        }
        logout(user) { user && !user.isLoggedOut && user.logOut(); }
    }
    exports.default = FirebaseAuthService;
});
define("src/controller/v1/services/firebaseFreetier/firebaseService", ["require", "exports", "firebase-admin", "src/controller/database/firebase/services/firebaseStorageService", "src/controller/database/firebase/services/firebaseRealtimeService", "src/controller/database/firebase/services/firebaseFirestoreService", "src/controller/database/firebase/services/firebaseAuthService", "crypto", "src/constants"], function (require, exports, firebase_admin_5, firebaseStorageService_1, firebaseRealtimeService_1, firebaseFirestoreService_1, firebaseAuthService_1, crypto_3, constants_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setNewPersistentFirebaseConnection = exports.persistentFirebaseConnection = void 0;
    firebase_admin_5 = __importDefault(firebase_admin_5);
    firebaseStorageService_1 = __importDefault(firebaseStorageService_1);
    firebaseRealtimeService_1 = __importDefault(firebaseRealtimeService_1);
    firebaseFirestoreService_1 = __importDefault(firebaseFirestoreService_1);
    firebaseAuthService_1 = __importDefault(firebaseAuthService_1);
    class FirebaseService {
        constructor(type, path) {
            this._appName = Array(10).fill(0).map(_ => String.fromCharCode((0, crypto_3.randomInt)(65, 90))).join('');
            this._app = firebase_admin_5.default.initializeApp(Object.assign({ credential: firebase_admin_5.default.credential.cert(constants_12.SERVICE_ACCOUNT_CREDENTIALS) }, constants_12.FIREBASE_CONFIG), this._appName);
            if (process.env.NODE_ENV !== 'production') {
            }
            if (this.verifyType(type, 1))
                this._storageService = new firebaseStorageService_1.default(this._app, path === null || path === void 0 ? void 0 : path.storageFolder);
            if (this.verifyType(type, 2))
                this._realtimeService = new firebaseRealtimeService_1.default(this._app, path === null || path === void 0 ? void 0 : path.realtimeUrl);
            if (this.verifyType(type, 4))
                this._firestoreService = new firebaseFirestoreService_1.default(this._app, path === null || path === void 0 ? void 0 : path.firestoreDocPath);
            if (this.verifyType(type, 8))
                this._auth = new firebaseAuthService_1.default(this._app, this._storageService || new firebaseStorageService_1.default(this._app));
        }
        get storageService() { return this._storageService; }
        get realtimeService() { return this._realtimeService; }
        get firestoreService() { return this._firestoreService; }
        get authService() { return this._auth; }
        close() {
            return __awaiter(this, void 0, void 0, function* () {
                yield firebase_admin_5.default.app(this._appName).delete();
                constants_12.logger.info("Database is successfully closed");
            });
        }
        verifyType(type, target) {
            return (type & target) == target;
        }
    }
    exports.default = FirebaseService;
    exports.persistentFirebaseConnection = new FirebaseService(2147483647, constants_12.firebasePathConfig);
    function setNewPersistentFirebaseConnection(newService) {
        exports.persistentFirebaseConnection.close().catch(() => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < 10; i++)
                yield exports.persistentFirebaseConnection.close();
        })).finally(() => {
            exports.persistentFirebaseConnection = newService !== null && newService !== void 0 ? newService : new FirebaseService(2147483647, constants_12.firebasePathConfig);
        });
    }
    exports.setNewPersistentFirebaseConnection = setNewPersistentFirebaseConnection;
});
define("src/model/v1/events/databaseErrorEvent", ["require", "exports", "src/constants", "src/model/v1/events/databaseEvent"], function (require, exports, constants_13, databaseEvent_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseEvent_3 = __importDefault(databaseEvent_3);
    class DatabaseErrorEvent extends databaseEvent_3.default {
        constructor(reason, statusCode = 200) {
            super({
                type: "Error",
                info: "An error occurred!",
                error: reason,
                warning: "",
                values: {
                    statusCode
                }
            });
            constants_13.logger.info("A DatabaseErrorEvent is created!");
        }
    }
    exports.default = DatabaseErrorEvent;
});
define("src/utility/filterDatabaseEvent", ["require", "exports", "src/model/v1/events/databaseErrorEvent", "src/model/patterns/option"], function (require, exports, databaseErrorEvent_1, option_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.filterDatabaseEvent = void 0;
    databaseErrorEvent_1 = __importDefault(databaseErrorEvent_1);
    function filterDatabaseEvent(events, filterType) {
        const arr = events.filter(ev => filterType && typeof (filterType) == 'object' && !(ev instanceof filterType));
        if (arr.length == 0) {
            const withoutErrArr = events.filter(ev => !(ev instanceof databaseErrorEvent_1.default));
            return withoutErrArr.length >= 1 ? (0, option_2.Some)(withoutErrArr[0]) : option_2.None;
        }
        return arr.length >= 1 ? (0, option_2.Some)(arr[0]) : option_2.None;
    }
    exports.filterDatabaseEvent = filterDatabaseEvent;
});
define("src/utility/shorthandOps", ["require", "exports", "src/model/patterns/option", "src/controller/database/firebase/services/firebaseRealtimeService", "src/controller/v1/services/firebaseFreetier/firebaseService", "src/constants", "src/model/v1/events/databaseErrorEvent", "src/utility/filterDatabaseEvent"], function (require, exports, option_3, firebaseRealtimeService_2, firebaseService_1, constants_14, databaseErrorEvent_2, filterDatabaseEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createWriteEvent = exports.getRealtimeContent = void 0;
    databaseErrorEvent_2 = __importDefault(databaseErrorEvent_2);
    const realtime = firebaseService_1.persistentFirebaseConnection.realtimeService;
    function getRealtimeContent(documentPath, field, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = option_3.None;
            yield realtime.getContent(documentPath, (ref) => __awaiter(this, void 0, void 0, function* () {
                let query = null;
                if (field)
                    query = ref.orderByChild(field);
                if (options === null || options === void 0 ? void 0 : options.equalToValue)
                    query = (query !== null && query !== void 0 ? query : ref).equalTo(options.equalToValue);
                if (typeof (options === null || options === void 0 ? void 0 : options.limitToFirst) === 'number')
                    query = (query !== null && query !== void 0 ? query : ref).limitToFirst(options.limitToFirst);
                result = yield (0, firebaseRealtimeService_2.getQueryResultAsArray)(query !== null && query !== void 0 ? query : ref.limitToFirst(100));
            })).catch(() => { });
            return result;
        });
    }
    exports.getRealtimeContent = getRealtimeContent;
    function createWriteEvent({ data, protectedMethods, publisher, serverLogErrorMsg }, DatabaseEventType) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new DatabaseEventType(Object.assign(Object.assign({}, data), { protected: protectedMethods }));
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield publisher.notifyAsync(event)).unwrapOrElse(() => {
                constants_14.logger.error(serverLogErrorMsg);
                return new databaseErrorEvent_2.default("The action is failed to be executed", 400);
            });
        });
    }
    exports.createWriteEvent = createWriteEvent;
});
define("src/controller/v1/services/firebaseFreetier/actuatorService", ["require", "exports", "src/model/v1/read/actuatorDto", "src/constants", "src/model/v1/events/databaseAddEvent", "src/model/v1/events/databaseUpdateEvent", "src/controller/v1/services/firebaseFreetier/firebaseService", "src/model/patterns/option", "src/utility/shorthandOps", "src/constants"], function (require, exports, actuatorDto_1, constants_15, databaseAddEvent_1, databaseUpdateEvent_1, firebaseService_2, option_4, shorthandOps_1, constants_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseAddEvent_1 = __importDefault(databaseAddEvent_1);
    databaseUpdateEvent_1 = __importDefault(databaseUpdateEvent_1);
    const realtime = firebaseService_2.persistentFirebaseConnection.realtimeService;
    const firestore = firebaseService_2.persistentFirebaseConnection.firestoreService;
    class ActuatorService {
        constructor(publisher) {
            this.publisher = publisher;
        }
        getActuators() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_16.COMPONENTS_PATH.actuator, null, { limitToFirst: constants_15.ACTUATOR_LIMIT });
                constants_15.logger.debug(`All actuators: ${result}`);
                return result.map(arr => {
                    const newArr = arr.map(json => actuatorDto_1.ActuatorDTO.fromJson(json));
                    return (0, option_4.Some)(newArr);
                });
            });
        }
        getActuatorsByType(type) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_16.COMPONENTS_PATH.actuator, "type", { equalToValue: type });
                constants_15.logger.debug(`Actuators by type: ${result}`);
                return result.map(arr => {
                    const newArr = arr.map(json => actuatorDto_1.ActuatorDTO.fromJson(json));
                    return (0, option_4.Some)(newArr);
                });
            });
        }
        getActuatorByName(name) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_16.COMPONENTS_PATH.actuator, "name", { equalToValue: name });
                constants_15.logger.debug(`Actuator by name: ${result}`);
                return result.map(arr => (0, option_4.Some)(actuatorDto_1.ActuatorDTO.fromJson(arr[0])));
            });
        }
        getActuatorConfig() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_16.COMPONENTS_PATH.actuatorConfig);
                constants_15.logger.debug(`Actuator config(s): ${result}`);
                return result.map(arr => {
                    const newArr = arr.map(json => actuatorDto_1.ActuatorConfigDTO.fromJson(json));
                    return (0, option_4.Some)(newArr);
                });
            });
        }
        getProposedActuatorConfig() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_16.COMPONENTS_PATH.actuatorConfigProposed);
                constants_15.logger.debug(`Proposed actuator config(s): ${result}`);
                return result.map(arr => {
                    const newArr = arr.map(json => actuatorDto_1.ActuatorConfigDTO.fromJson(json));
                    return (0, option_4.Some)(newArr);
                });
            });
        }
        addActuator(actuator) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof (actuator.isRunning) === 'undefined')
                    actuator.isRunning = true;
                return yield (0, shorthandOps_1.createWriteEvent)({
                    data: actuator,
                    protectedMethods: {
                        write(_) {
                            return __awaiter(this, void 0, void 0, function* () {
                                const result = yield firestore.queryCollection(constants_16.COMPONENTS_PATH.actuator, collectionRef => collectionRef.where("name", "==", actuator.name).get());
                                if (!result.empty) {
                                    constants_15.logger.error(`An actuator of the same name has already existed in the database: "${actuator.name}"`);
                                    return Promise.reject(`400An actuator with the same name "${actuator.name}" has already existed in the database`);
                                }
                                yield firestore.addContentToCollection(constants_16.COMPONENTS_PATH.actuator, actuator);
                            });
                        },
                        read() {
                            return __awaiter(this, void 0, void 0, function* () {
                                let result = yield (0, shorthandOps_1.getRealtimeContent)(constants_16.COMPONENTS_PATH.actuator, "name", { equalToValue: actuator.name });
                                if (result.match.isNone())
                                    yield realtime.pushContent(actuator, constants_16.COMPONENTS_PATH.actuator);
                            });
                        }
                    },
                    publisher: this.publisher,
                    serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 131"
                }, databaseAddEvent_1.default);
            });
        }
        updateActuator(actuator) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, shorthandOps_1.createWriteEvent)({
                    data: actuator,
                    protectedMethods: {
                        write(currentEvent) {
                            return __awaiter(this, void 0, void 0, function* () {
                                const docs = (yield firestore.queryCollection(constants_16.COMPONENTS_PATH.actuator, collectionRef => collectionRef.where("name", "==", actuator.name).get())).docs;
                                if (docs.length == 0)
                                    return Promise.reject("404Specified name does not match with anything in the database");
                                if (docs.length > 1) {
                                    currentEvent.content.warning = "Ambiguity: There are more than 2 actuators with the same name!";
                                    return Promise.reject("400Could not update actuator details due to ambiguity");
                                }
                                yield firestore.updateDocument(docs[0].id, actuator);
                            });
                        },
                        read() {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield realtime.getContent(constants_16.COMPONENTS_PATH.actuator, (ref) => __awaiter(this, void 0, void 0, function* () {
                                    yield ref.orderByChild("name").equalTo(actuator.name).once("child_added", child => {
                                        realtime.updateContent(actuator, `${constants_16.COMPONENTS_PATH.actuator}/${child.key}`);
                                    });
                                }));
                            });
                        }
                    },
                    publisher: this.publisher,
                    serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 169"
                }, databaseUpdateEvent_1.default);
            });
        }
        updateActuatorConfig(actuatorName, actuatorConfig) {
            return __awaiter(this, void 0, void 0, function* () {
                const updateContent = Object.assign({ actuatorName }, actuatorConfig);
                return yield (0, shorthandOps_1.createWriteEvent)({
                    data: updateContent,
                    protectedMethods: {
                        write() {
                            return __awaiter(this, void 0, void 0, function* () {
                                const docPath = `${constants_16.COMPONENTS_PATH.actuatorConfig}/${actuatorName}`;
                                const result = yield firestore.getDocument(docPath);
                                if (!result.exists) {
                                    yield firestore.setDocument(docPath, updateContent);
                                    return;
                                }
                                yield firestore.updateDocument(docPath, updateContent);
                            });
                        },
                        read() {
                            return __awaiter(this, void 0, void 0, function* () {
                                const path = `${constants_16.COMPONENTS_PATH.actuatorConfig}/${actuatorName}`;
                                const content = yield realtime.getContent(path);
                                if (!content.exists()) {
                                    yield realtime.setContent(updateContent, path);
                                    return;
                                }
                                yield realtime.updateContent(updateContent, path);
                            });
                        }
                    },
                    publisher: this.publisher,
                    serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 225"
                }, databaseUpdateEvent_1.default);
            });
        }
        updateProposedActuatorConfig(actuatorName, actuatorConfig) {
            return __awaiter(this, void 0, void 0, function* () {
                const updateContent = Object.assign({ actuatorName }, actuatorConfig);
                return yield (0, shorthandOps_1.createWriteEvent)({
                    data: updateContent,
                    protectedMethods: {
                        write() {
                            return __awaiter(this, void 0, void 0, function* () {
                                const docPath = `${constants_16.COMPONENTS_PATH.actuatorConfigProposed}/${actuatorName}`;
                                const result = yield firestore.getDocument(docPath);
                                if (!result.exists) {
                                    yield firestore.setDocument(docPath, updateContent);
                                    return;
                                }
                                yield firestore.updateDocument(docPath, updateContent);
                            });
                        },
                        read() {
                            return __awaiter(this, void 0, void 0, function* () {
                                const path = `${constants_16.COMPONENTS_PATH.actuatorConfigProposed}/${actuatorName}`;
                                const content = yield realtime.getContent(path);
                                if (!content.exists()) {
                                    yield realtime.setContent(updateContent, path);
                                    return;
                                }
                                yield realtime.updateContent(updateContent, path);
                            });
                        }
                    },
                    publisher: this.publisher,
                    serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 272"
                }, databaseUpdateEvent_1.default);
            });
        }
    }
    exports.default = ActuatorService;
});
define("src/controller/v1/methods/read/actuatorReadMethods", ["require", "exports", "tsoa", "src/constants", "src/controller/v1/services/firebaseFreetier/actuatorService"], function (require, exports, tsoa_1, constants_17, actuatorService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActuatorReadMethods = void 0;
    actuatorService_1 = __importDefault(actuatorService_1);
    let ActuatorReadMethods = class ActuatorReadMethods extends tsoa_1.Controller {
        getActuators(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_17.logger.info("ActuatorReadMethods: Getting all actuators from the database");
                const option = yield new actuatorService_1.default().getActuators();
                return option.unwrapOrElse(() => {
                    this.setStatus(408);
                    return [];
                });
            });
        }
        getCategorizedActuators(accessToken, typeOrName) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_17.logger.info(`ActuatorReadMethods: Getting categorized actuators from the database "${typeOrName}"`);
                const actuatorService = new actuatorService_1.default();
                const actuatorsByType = yield actuatorService.getActuatorsByType(typeOrName);
                return yield actuatorsByType.unwrapOrElseAsync(() => __awaiter(this, void 0, void 0, function* () {
                    const actuatorByName = yield actuatorService.getActuatorByName(typeOrName);
                    return [actuatorByName.unwrapOrElse(() => {
                            this.setStatus(404);
                            return null;
                        })].filter(x => x != null);
                }));
            });
        }
        getActuatorConfigs(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_17.logger.info("ActuatorReadMethods: Getting actuator configs from the database");
                const option = yield new actuatorService_1.default().getActuatorConfig();
                return option.unwrapOrElse(() => {
                    this.setStatus(408);
                    return [];
                });
            });
        }
        getProposedActuatorConfigs(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_17.logger.info("ActuatorReadMethods: Getting proposed actuator configs from the database");
                const option = yield new actuatorService_1.default().getProposedActuatorConfig();
                return option.unwrapOrElse(() => {
                    this.setStatus(408);
                    return [];
                });
            });
        }
    };
    __decorate([
        (0, tsoa_1.Get)("get"),
        __param(0, (0, tsoa_1.Query)())
    ], ActuatorReadMethods.prototype, "getActuators", null);
    __decorate([
        (0, tsoa_1.Get)("{typeOrName}/get"),
        __param(0, (0, tsoa_1.Query)()),
        __param(1, (0, tsoa_1.Path)())
    ], ActuatorReadMethods.prototype, "getCategorizedActuators", null);
    __decorate([
        (0, tsoa_1.Get)("config/get"),
        __param(0, (0, tsoa_1.Query)())
    ], ActuatorReadMethods.prototype, "getActuatorConfigs", null);
    __decorate([
        (0, tsoa_1.Get)("config/proposed/get"),
        __param(0, (0, tsoa_1.Query)())
    ], ActuatorReadMethods.prototype, "getProposedActuatorConfigs", null);
    ActuatorReadMethods = __decorate([
        (0, tsoa_1.Security)("api_key"),
        (0, tsoa_1.Route)(`api/v1/actuator`),
        (0, tsoa_1.SuccessResponse)(200, "Ok"),
        (0, tsoa_1.Response)(403, "Forbidden"),
        (0, tsoa_1.Response)(404, "Not Found"),
        (0, tsoa_1.Response)(408, "Request Timeout")
    ], ActuatorReadMethods);
    exports.ActuatorReadMethods = ActuatorReadMethods;
});
define("src/model/dateRange", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/utility/helper", ["require", "exports", "luxon", "src/constants"], function (require, exports, luxon_4, constants_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.randomString = exports.hexStringConverter = exports.getDateRangeString = exports.orderByProp = void 0;
    function orderByProp(prop, ascending = true) {
        return (s1, s2) => {
            if (s1[prop] == s2[prop])
                return 0;
            const result = s1[prop] > s2[prop] ? 1 : -1;
            return ascending ? result : -result;
        };
    }
    exports.orderByProp = orderByProp;
    function getDateRangeString(dateRange) {
        return {
            start: luxon_4.DateTime.fromSeconds(dateRange.startDate || 0).setZone(constants_18.DATABASE_TIMEZONE).toISOTime(),
            end: (dateRange.endDate ? luxon_4.DateTime.fromSeconds(dateRange.endDate) : luxon_4.DateTime.now())
                .setZone(constants_18.DATABASE_TIMEZONE)
                .toISOTime()
        };
    }
    exports.getDateRangeString = getDateRangeString;
    function hexStringConverter(buffer) {
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    exports.hexStringConverter = hexStringConverter;
    const charList = (() => {
        let str = "";
        for (let i = 48; i <= 57; i++)
            str += String.fromCharCode(i);
        for (let i = 65; i <= 90; i++)
            str += String.fromCharCode(i);
        for (let i = 97; i <= 122; i++)
            str += String.fromCharCode(i);
        return str;
    })();
    function randomString(length, extendedCharList = "") {
        const newCharList = charList + extendedCharList;
        const len = charList.length;
        const randVals = Array.from(crypto.getRandomValues(new Uint8Array(length)));
        return randVals.map(num => newCharList[Math.round(num * (len - 1) / 255)]).join('');
    }
    exports.randomString = randomString;
});
define("src/model/v1/events/databaseCreateEvent", ["require", "exports", "src/constants", "src/model/v1/events/databaseEvent"], function (require, exports, constants_19, databaseEvent_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseEvent_4 = __importDefault(databaseEvent_4);
    class DatabaseCreateEvent extends databaseEvent_4.default {
        constructor(values) {
            super({
                type: "Ok",
                info: "A create event has been created. Committing changes to the database",
                error: "",
                warning: "",
                values
            });
            constants_19.logger.info("A DatabaseCreateEvent is created!");
        }
    }
    exports.default = DatabaseCreateEvent;
});
define("src/model/v1/read/dataSaving", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/model/v1/events/databaseDeleteEvent", ["require", "exports", "src/constants", "src/model/v1/events/databaseEvent"], function (require, exports, constants_20, databaseEvent_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseEvent_5 = __importDefault(databaseEvent_5);
    class DatabaseDeleteEvent extends databaseEvent_5.default {
        constructor(values) {
            super({
                type: "Ok",
                info: "An delete event has been created. Committing changes to the database",
                error: "",
                warning: "",
                values
            });
            constants_20.logger.info("A DatabaseDeleteEvent is created!");
        }
    }
    exports.default = DatabaseDeleteEvent;
});
define("src/utility/compression", ["require", "exports", "fflate", "src/constants", "src/model/patterns/option"], function (require, exports, fflate_1, constants_21, option_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressData = exports.compressJsonDataSync = void 0;
    function compressJsonDataSync(json, dateRange) {
        try {
            let name = `${dateRange.startDate};${dateRange.endDate}`;
            const byteArr = (0, fflate_1.strToU8)(JSON.stringify(json));
            const compressedData = (0, fflate_1.zlibSync)(byteArr, { level: 9 });
            name += `;${byteArr.byteLength}`;
            const fileName = `${Buffer.from(name, "ascii").toString("base64")}.${constants_21.COMPRESSION_SETTINGS.fileExtension}`;
            return (0, option_5.Some)({ fileName, compressedData });
        }
        catch (err) {
            constants_21.logger.error("CompressJsonDataSync - Data compression failed with the following error: " + err);
            return option_5.None;
        }
    }
    exports.compressJsonDataSync = compressJsonDataSync;
    function decompressData(compressedData, outLength) {
        try {
            const rawDecompressed = (0, fflate_1.decompressSync)(compressedData, outLength ? new Uint8Array(outLength) : null);
            const jsonStr = (0, fflate_1.strFromU8)(rawDecompressed);
            return (0, option_5.Some)(JSON.parse(jsonStr));
        }
        catch (err) {
            constants_21.logger.error("DecompressData - Data decompression failed with following error: " + err);
            return option_5.None;
        }
    }
    exports.decompressData = decompressData;
});
define("src/model/v1/write/sensors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/controller/v1/services/firebaseFreetier/utility/dataSavingService", ["require", "exports", "luxon", "src/constants", "src/model/v1/events/databaseCreateEvent", "src/model/v1/events/databaseDeleteEvent", "src/model/v1/events/databaseErrorEvent", "src/utility/compression", "src/utility/filterDatabaseEvent", "src/controller/v1/services/firebaseFreetier/firebaseService", "src/model/patterns/option"], function (require, exports, luxon_5, constants_22, databaseCreateEvent_1, databaseDeleteEvent_1, databaseErrorEvent_3, compression_1, filterDatabaseEvent_2, firebaseService_3, option_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deleteSnapshots = exports.uploadSnapshot = exports.customFlat = exports.getSnapshotsFromDateRange = exports.parseStorageFileMetaData = exports.mergeDefaultDateRange = void 0;
    databaseCreateEvent_1 = __importDefault(databaseCreateEvent_1);
    databaseDeleteEvent_1 = __importDefault(databaseDeleteEvent_1);
    databaseErrorEvent_3 = __importDefault(databaseErrorEvent_3);
    const storage = firebaseService_3.persistentFirebaseConnection.storageService;
    function mergeDefaultDateRange(dateRange) {
        return {
            startDate: (dateRange === null || dateRange === void 0 ? void 0 : dateRange.startDate) || 0,
            endDate: (dateRange === null || dateRange === void 0 ? void 0 : dateRange.endDate) || luxon_5.DateTime.now().setZone(constants_22.DATABASE_TIMEZONE).toUnixInteger()
        };
    }
    exports.mergeDefaultDateRange = mergeDefaultDateRange;
    function parseStorageFileMetaData(rawMetaData) {
        const [metadata] = rawMetaData;
        const rawFileName = metadata.name.split(/[\/\\]/).pop().split('.')[0];
        return [parseInt(rawFileName), metadata];
    }
    exports.parseStorageFileMetaData = parseStorageFileMetaData;
    function getSnapshotsFromDateRange(folderPath, dateRange, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [files] = yield storage.readFolderFromStorage(folderPath);
            if (!files)
                return option_6.None;
            constants_22.logger.debug(`There are ${files.length} in ${folderPath}`);
            const result = [];
            options = options !== null && options !== void 0 ? options : { downloadData: true };
            for (const file of files) {
                const [startDate, endDate, byteLength] = parseStorageFileMetaData(yield file.getMetadata());
                if (endDate <= dateRange.startDate || startDate >= dateRange.endDate)
                    continue;
                if (options.downloadData) {
                    const downloadContent = yield file.download().then(res => res[0]);
                    const decompressedData = (0, compression_1.decompressData)(downloadContent, byteLength).unwrapOr(null);
                    decompressedData && result.push(options.filter ? options.filter(decompressedData) : decompressedData);
                    continue;
                }
                result.push((0, option_6.Some)(""));
            }
            return result.length == 0 ? option_6.None : (0, option_6.Some)(result);
        });
    }
    exports.getSnapshotsFromDateRange = getSnapshotsFromDateRange;
    const lowerCeiling = (data, dateRange) => data.timeStamp >= dateRange.startDate, higherCeiling = (data, dateRange) => data.timeStamp <= dateRange.endDate;
    const customFlat = (option, dateRange, filter) => {
        const result = [];
        option.unwrapOr([]).map((dataByDay, index) => {
            if (!Array.isArray(dataByDay))
                return;
            for (const data of dataByDay) {
                if (index != 0 || index != data.length - 1
                    || (lowerCeiling(data, dateRange) && higherCeiling(data, dateRange) && (!filter || filter(data))))
                    result.push(data);
            }
        });
        return result.length == 0 ? option_6.None : (0, option_6.Some)(result);
    };
    exports.customFlat = customFlat;
    const uploadSnapshot = (snapshot, dateRange, folder, publisher, errorOccurrenceLine) => __awaiter(void 0, void 0, void 0, function* () {
        const event = new databaseCreateEvent_1.default({
            protected: {
                storage() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const option = (0, compression_1.compressJsonDataSync)(snapshot, dateRange);
                        if (option.match.isNone())
                            Promise.reject();
                        const result = option.unwrapOr(null);
                        if (!result)
                            return;
                        result.fileName = `${folder}/${result.fileName}`;
                        yield storage.uploadBytesToStorage(result.fileName, Buffer.from(result.compressedData));
                    });
                }
            }
        });
        return (0, filterDatabaseEvent_2.filterDatabaseEvent)(yield publisher.notifyAsync(event)).unwrapOrElse(() => {
            constants_22.logger.error("DataSavingService: DatabaseEvent filtration leads to all error ~ " + errorOccurrenceLine);
            return new databaseErrorEvent_3.default("The action is failed to be executed", 400);
        });
    });
    exports.uploadSnapshot = uploadSnapshot;
    const deleteSnapshots = (folderName, dateRange, publisher) => __awaiter(void 0, void 0, void 0, function* () {
        dateRange = mergeDefaultDateRange(dateRange);
        const event = new databaseDeleteEvent_1.default({
            protected: {
                storage() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const files = yield getSnapshotsFromDateRange(folderName, dateRange, { downloadData: false });
                        for (const { byteLength, file } of files.unwrapOr([])) {
                            yield file.delete();
                        }
                    });
                }
            }
        });
        return (0, filterDatabaseEvent_2.filterDatabaseEvent)(yield publisher.notifyAsync(event)).unwrapOrElse(() => {
            constants_22.logger.error("DataSavingService: DatabaseEvent filtration leads to all error ~ 289");
            return new databaseErrorEvent_3.default("The action is failed to be executed", 400);
        });
    });
    exports.deleteSnapshots = deleteSnapshots;
});
define("src/controller/v1/services/firebaseFreetier/dataSavingService", ["require", "exports", "src/constants", "src/controller/v1/services/firebaseFreetier/firebaseService", "src/model/v1/events/databaseCreateEvent", "src/utility/filterDatabaseEvent", "src/utility/helper", "src/model/patterns/option", "src/model/v1/events/databaseErrorEvent", "src/constants", "src/controller/v1/services/firebaseFreetier/utility/dataSavingService", "luxon", "fflate"], function (require, exports, constants_23, firebaseService_4, databaseCreateEvent_2, filterDatabaseEvent_3, helper_1, option_7, databaseErrorEvent_4, constants_24, dataSavingService_1, luxon_6, fflate_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseCreateEvent_2 = __importDefault(databaseCreateEvent_2);
    databaseErrorEvent_4 = __importDefault(databaseErrorEvent_4);
    const storage = firebaseService_4.persistentFirebaseConnection.storageService;
    class DataSavingService {
        constructor(publisher) {
            this.publisher = publisher;
        }
        retrieveSensorSnapshot(runNumber) {
            return __awaiter(this, void 0, void 0, function* () {
                const folderPath = `${constants_24.COMPONENTS_PATH.storage.sensor}/run${runNumber}`;
                const response = yield storage.readFolderFromStorage(folderPath);
                if (!response)
                    return option_7.None;
                const [files] = response;
                if (!files.length)
                    return option_7.None;
                constants_23.logger.debug(`There are ${files.length} in ${folderPath}`);
                const result = [];
                for (const file of files) {
                    const [byteLength, _] = (0, dataSavingService_1.parseStorageFileMetaData)(yield file.getMetadata());
                    const [signedUrl] = yield file.getSignedUrl({
                        action: "read",
                        expires: luxon_6.DateTime.now().toUTC().toUnixInteger() * 1000 + 1000 * 3600 * 24,
                    });
                    result.push({
                        newFileName: `lida_run${runNumber}.zip`,
                        downloadUrl: signedUrl,
                        decompressionByteLength: byteLength,
                        note: "The download link will expire today"
                    });
                }
                return (0, option_7.Some)(result);
            });
        }
        retrieveSensorLogSnapshots(dateRange) {
            return __awaiter(this, void 0, void 0, function* () {
                dateRange = (0, dataSavingService_1.mergeDefaultDateRange)(dateRange);
                const data = yield (0, dataSavingService_1.getSnapshotsFromDateRange)(`${constants_24.COMPONENTS_PATH.storage.log}/sensor`, dateRange);
                return (0, dataSavingService_1.customFlat)(data, dateRange);
            });
        }
        retrieveActuatorLogSnapshots(dateRange) {
            return __awaiter(this, void 0, void 0, function* () {
                dateRange = (0, dataSavingService_1.mergeDefaultDateRange)(dateRange);
                const data = yield (0, dataSavingService_1.getSnapshotsFromDateRange)(`${constants_24.COMPONENTS_PATH.storage.log}/actuator`, dateRange);
                return (0, dataSavingService_1.customFlat)(data, dateRange);
            });
        }
        retrieveSystemCommandLogSnapshots(dateRange) {
            return __awaiter(this, void 0, void 0, function* () {
                dateRange = (0, dataSavingService_1.mergeDefaultDateRange)(dateRange);
                const data = yield (0, dataSavingService_1.getSnapshotsFromDateRange)(`${constants_24.COMPONENTS_PATH.storage.log}/systemCommand`, dateRange);
                return (0, dataSavingService_1.customFlat)(data, dateRange);
            });
        }
        uploadSensorSnapshot(snapshots, runNumber) {
            return __awaiter(this, void 0, void 0, function* () {
                const folderName = `${constants_24.COMPONENTS_PATH.storage.sensor}/run${runNumber}`;
                const sensorName = snapshots.sensor.sort((0, helper_1.orderByProp)("name"));
                const sensorData = new Object();
                snapshots.data.map((obj, systemDay) => {
                    Object.assign(sensorData, {
                        [`day#${systemDay}`]: obj
                    });
                });
                const event = new databaseCreateEvent_2.default({
                    protected: {
                        storage() {
                            return __awaiter(this, void 0, void 0, function* () {
                                let buffer = null;
                                (0, fflate_2.zip)({
                                    "sensor_names_and_statuses.json": [(0, fflate_2.strToU8)(JSON.stringify(sensorName)), {}],
                                    "sensor_data.json": [(0, fflate_2.strToU8)(JSON.stringify(sensorData)), {}]
                                }, { level: 9 }, (err, data) => {
                                    if (err)
                                        throw err;
                                    buffer = Buffer.from(data);
                                    storage.uploadBytesToStorage(`${folderName}/${buffer.byteLength}.zip`, buffer).then(() => {
                                        constants_23.logger.debug("It worked ~ DataSavingService.ts line 128");
                                    }, (reason) => {
                                        constants_23.logger.error(`Error: ${reason} ~ DataSavingService.ts line 130`);
                                    });
                                });
                            });
                        }
                    }
                });
                return (0, filterDatabaseEvent_3.filterDatabaseEvent)(yield this.publisher.notifyAsync(event)).unwrapOrElse(() => {
                    constants_23.logger.error("DataSavingService: DatabaseEvent filtration leads to all error ~ 119");
                    return new databaseErrorEvent_4.default("The action is failed to be executed", 400);
                });
            });
        }
        uploadLogSnapshot(snapshot, dateRange) {
            return __awaiter(this, void 0, void 0, function* () {
                dateRange = (0, dataSavingService_1.mergeDefaultDateRange)(dateRange);
                snapshot = {
                    sensor: snapshot.sensor.sort((0, helper_1.orderByProp)("timeStamp")),
                    actuator: snapshot.actuator.sort((0, helper_1.orderByProp)("timeStamp")),
                    systemCommand: snapshot.systemCommand.sort((0, helper_1.orderByProp)("timeStamp"))
                };
                return (0, filterDatabaseEvent_3.filterDatabaseEvent)([
                    yield (0, dataSavingService_1.uploadSnapshot)(snapshot.sensor, dateRange, `${constants_24.COMPONENTS_PATH.storage.log}/sensor`, this.publisher, 282),
                    yield (0, dataSavingService_1.uploadSnapshot)(snapshot.actuator, dateRange, `${constants_24.COMPONENTS_PATH.storage.log}/actuator`, this.publisher, 283),
                    yield (0, dataSavingService_1.uploadSnapshot)(snapshot.systemCommand, dateRange, `${constants_24.COMPONENTS_PATH.storage.log}/systemCommand`, this.publisher, 284),
                ], databaseCreateEvent_2.default).unwrapOr(new databaseErrorEvent_4.default("Could not retrieve saved log snapshots", 404));
            });
        }
        deleteSensorSnapshot(runNumber) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, dataSavingService_1.deleteSnapshots)(`${constants_24.COMPONENTS_PATH.storage.sensor}/run${runNumber}`, (0, dataSavingService_1.mergeDefaultDateRange)({}), this.publisher);
            });
        }
        deleteLogSnapshots(dateRange) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, dataSavingService_1.deleteSnapshots)(constants_24.COMPONENTS_PATH.storage.log, dateRange, this.publisher);
            });
        }
    }
    exports.default = DataSavingService;
});
define("src/controller/v1/methods/read/dataSavingReadMethods", ["require", "exports", "tsoa", "src/constants", "src/controller/v1/services/firebaseFreetier/dataSavingService"], function (require, exports, tsoa_2, constants_25, dataSavingService_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataSavingReadMethods = void 0;
    dataSavingService_2 = __importDefault(dataSavingService_2);
    let DataSavingReadMethods = class DataSavingReadMethods extends tsoa_2.Controller {
        retrieveSensorDataRunSnapshot(accessToken, runNumber) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_25.logger.info(`DataSavingReadMethods: Getting run #${runNumber} sensor snapshot from the database`);
                const option = yield new dataSavingService_2.default().retrieveSensorSnapshot(runNumber);
                return option.unwrapOrElse(() => {
                    this.setStatus(404);
                    return [];
                });
            });
        }
    };
    __decorate([
        (0, tsoa_2.Get)("sensor/{runNumber}/get"),
        __param(0, (0, tsoa_2.Query)()),
        __param(1, (0, tsoa_2.Path)())
    ], DataSavingReadMethods.prototype, "retrieveSensorDataRunSnapshot", null);
    DataSavingReadMethods = __decorate([
        (0, tsoa_2.Security)("api_key"),
        (0, tsoa_2.Route)(`api/v1/snapshot`),
        (0, tsoa_2.SuccessResponse)(200, "Ok"),
        (0, tsoa_2.Response)("403", "Forbidden"),
        (0, tsoa_2.Response)("408", "Request Timeout")
    ], DataSavingReadMethods);
    exports.DataSavingReadMethods = DataSavingReadMethods;
});
define("src/model/v1/read/sensorDto", ["require", "exports", "luxon", "src/constants"], function (require, exports, luxon_7, constants_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SensorDataDTO = exports.SensorDTO = void 0;
    class SensorDTO {
        constructor(name, type, isRunning) {
            this.name = name;
            this.type = type;
            this.isRunning = isRunning;
        }
        toJson() {
            return {
                name: this.name,
                type: this.type,
                isRunning: this.isRunning
            };
        }
        static fromJson(sensorJson) {
            return new SensorDTO(typeof (sensorJson.name) === 'string' ? sensorJson.name : "", typeof (sensorJson.type) === 'string' ? sensorJson.type : "", typeof (sensorJson.isRunning) === 'boolean' ? sensorJson.isRunning : true);
        }
    }
    exports.SensorDTO = SensorDTO;
    class SensorDataDTO {
        constructor(sensorName, value, timeStamp) {
            this.sensorName = sensorName;
            this.value = value;
            this.timeStamp = timeStamp;
        }
        toJson() {
            return {
                sensorName: this.sensorName,
                value: this.value,
                timeStamp: this.timeStamp
            };
        }
        static fromJson(sensorJson) {
            const unixNow = luxon_7.DateTime.now().setZone(constants_26.DATABASE_TIMEZONE).toUnixInteger();
            return new SensorDataDTO(typeof (sensorJson.sensorName) === 'string' ? sensorJson.sensorName : '', typeof (sensorJson.value) === 'number' ? sensorJson.value : -1, typeof (sensorJson.timeStamp) === 'number' ? sensorJson.timeStamp : unixNow);
        }
    }
    exports.SensorDataDTO = SensorDataDTO;
});
define("src/controller/v1/services/firebaseFreetier/utility/sensorService", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEachSensorLatestData = void 0;
    function getEachSensorLatestData(rawData) {
        const dict = {};
        const result = [];
        rawData.map(dto => {
            const val = dict[dto.sensorName];
            if (!val || dto.timeStamp > val.timeStamp)
                dict[dto.sensorName] = dto;
        });
        for (const name in dict)
            result.push(dict[name]);
        return result;
    }
    exports.getEachSensorLatestData = getEachSensorLatestData;
});
define("src/controller/v1/services/firebaseFreetier/sensorService", ["require", "exports", "src/constants", "src/model/v1/read/sensorDto", "src/model/v1/events/databaseAddEvent", "src/model/v1/events/databaseUpdateEvent", "src/controller/v1/services/firebaseFreetier/firebaseService", "src/controller/database/firebase/services/firebaseRealtimeService", "luxon", "src/model/patterns/option", "src/utility/shorthandOps", "src/constants", "src/controller/v1/services/firebaseFreetier/utility/sensorService", "src/utility/helper", "src/model/v1/events/databaseDeleteEvent"], function (require, exports, constants_27, sensorDto_1, databaseAddEvent_2, databaseUpdateEvent_2, firebaseService_5, firebaseRealtimeService_3, luxon_8, option_8, shorthandOps_2, constants_28, sensorService_1, helper_2, databaseDeleteEvent_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseAddEvent_2 = __importDefault(databaseAddEvent_2);
    databaseUpdateEvent_2 = __importDefault(databaseUpdateEvent_2);
    databaseDeleteEvent_2 = __importDefault(databaseDeleteEvent_2);
    const realtime = firebaseService_5.persistentFirebaseConnection.realtimeService;
    const firestore = firebaseService_5.persistentFirebaseConnection.firestoreService;
    class SensorService {
        constructor(publisher) {
            this.publisher = publisher;
        }
        getSensors() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield (0, shorthandOps_2.getRealtimeContent)(constants_28.COMPONENTS_PATH.sensor, null, { limitToFirst: constants_27.SENSOR_LIMIT });
                constants_27.logger.debug(`All sensors: ${result}`);
                return result.map(arr => {
                    const newArr = arr.map((val) => sensorDto_1.SensorDTO.fromJson(val));
                    return (0, option_8.Some)(newArr);
                });
            });
        }
        getSensorsByType(type) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield (0, shorthandOps_2.getRealtimeContent)(constants_28.COMPONENTS_PATH.sensor, "type", { equalToValue: type });
                constants_27.logger.debug(`Sensors by type: ${result}`);
                return result.map(arr => {
                    const newArr = arr.map((val) => sensorDto_1.SensorDTO.fromJson(val));
                    return (0, option_8.Some)(newArr);
                });
            });
        }
        getSensorByName(name) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield (0, shorthandOps_2.getRealtimeContent)(constants_28.COMPONENTS_PATH.sensor, "name", { equalToValue: name });
                constants_27.logger.debug(`Sensor by name: ${result}`);
                return result.map(arr => {
                    const sensor = sensorDto_1.SensorDTO.fromJson(arr[0]);
                    return (0, option_8.Some)(sensor);
                });
            });
        }
        getSensorData(dateRange = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                dateRange.startDate = dateRange.startDate || 0;
                dateRange.endDate = dateRange.endDate || luxon_8.DateTime.now().setZone(constants_27.DATABASE_TIMEZONE).toUnixInteger();
                let result = option_8.None;
                yield realtime.getContent(constants_28.COMPONENTS_PATH.sensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                    result = yield (0, firebaseRealtimeService_3.getQueryResultAsArray)(ref.orderByKey(), json => {
                        const timestamp = json.timeStamp;
                        constants_27.logger.debug("Get sensor data - timeStamp: " + json.timeStamp);
                        return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate;
                    });
                }));
                constants_27.logger.debug(`Sensor data by name: ${result}`);
                return result.map(data => {
                    const arr = data.map(val => sensorDto_1.SensorDataDTO.fromJson(val)).sort((0, helper_2.orderByProp)("timeStamp", false));
                    return (0, option_8.Some)(arr);
                });
            });
        }
        getSensorDataByName(name, dateRange = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                dateRange.startDate = dateRange.startDate || 0;
                dateRange.endDate = dateRange.endDate || luxon_8.DateTime.now().setZone(constants_27.DATABASE_TIMEZONE).toUnixInteger();
                let result = option_8.None;
                yield realtime.getContent(constants_28.COMPONENTS_PATH.sensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                    result = yield (0, firebaseRealtimeService_3.getQueryResultAsArray)(ref.orderByChild("sensorName").equalTo(name), json => {
                        const timestamp = json.timeStamp;
                        return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate;
                    });
                }));
                constants_27.logger.debug(`Sensor data by name: ${result}`);
                return result.map(data => {
                    const arr = data.map(val => sensorDto_1.SensorDataDTO.fromJson(val)).sort((0, helper_2.orderByProp)("timeStamp", false));
                    return (0, option_8.Some)(arr);
                });
            });
        }
        getSensorDataSnapshot(dateRange = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                dateRange = {
                    startDate: dateRange.startDate || 0,
                    endDate: dateRange.endDate || luxon_8.DateTime.now().setZone(constants_27.DATABASE_TIMEZONE).toUnixInteger()
                };
                const cachedEndDate = luxon_8.DateTime.fromSeconds(dateRange.endDate);
                const boundTimeObj = luxon_8.DateTime.local(cachedEndDate.year, cachedEndDate.month, cachedEndDate.day + 1).setZone(constants_27.DATABASE_TIMEZONE);
                let currentDayCount = 1;
                let [upperBoundTime, lowerBoundTime] = [
                    boundTimeObj.toUnixInteger(),
                    boundTimeObj.minus({ day: currentDayCount++ }).toUnixInteger()
                ];
                let result = [[]];
                yield realtime.getContent(constants_28.COMPONENTS_PATH.sensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                    yield ref.orderByChild("timeStamp").once('value', snapshot => {
                        if (!snapshot.exists()) {
                            constants_27.logger.warn("Snapshot does not exist with a value of " + snapshot.val());
                            return;
                        }
                        snapshot.forEach(child => {
                            const json = child.val();
                            const timestamp = json.timeStamp;
                            if (timestamp <= upperBoundTime) {
                                if (timestamp < lowerBoundTime) {
                                    if (lowerBoundTime < dateRange.startDate)
                                        return;
                                    [upperBoundTime, lowerBoundTime] = [
                                        lowerBoundTime,
                                        boundTimeObj.minus({ day: currentDayCount++ }).toUnixInteger()
                                    ];
                                    result.push([json]);
                                    return;
                                }
                                result[result.length - 1].push(json);
                            }
                        });
                    });
                }));
                constants_27.logger.debug(`SensorData by date: ${result}`);
                return !result.length ? option_8.None : (0, option_8.Some)(result.reverse());
            });
        }
        getLatestSensorData() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = option_8.None;
                yield realtime.getContent(constants_28.COMPONENTS_PATH.sensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                    const sensorNames = yield this.getSensors();
                    if (sensorNames.match.isNone())
                        return;
                    result = yield (0, firebaseRealtimeService_3.getQueryResultAsArray)(ref.orderByChild("timeStamp").limitToLast(sensorNames.unwrapOr([]).length * 3));
                    result = result.map(val => (0, option_8.Some)((0, sensorService_1.getEachSensorLatestData)(val)));
                }));
                constants_27.logger.debug(`Sensor data by Name: ${result}`);
                return result;
            });
        }
        getLatestSensorDataByName(name) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = option_8.None;
                yield realtime.getContent(constants_28.COMPONENTS_PATH.sensorData, (ref) => __awaiter(this, void 0, void 0, function* () {
                    const temp = yield (0, firebaseRealtimeService_3.getQueryResultAsArray)(ref.orderByChild("sensorName").equalTo(name).limitToFirst(1));
                    result = temp.map(arr => !arr[0] ? option_8.None : (0, option_8.Some)(arr[0]));
                }));
                constants_27.logger.debug(`Latest sensor data by name: ${result.unwrapOr(null)}`);
                return result;
            });
        }
        addSensor(sensor) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof (sensor.isRunning) === 'undefined')
                    sensor.isRunning = true;
                return yield (0, shorthandOps_2.createWriteEvent)({
                    data: sensor,
                    protectedMethods: {
                        write() {
                            return __awaiter(this, void 0, void 0, function* () {
                                const result = yield firestore.queryCollection(constants_28.COMPONENTS_PATH.sensor, collectionRef => collectionRef.where("name", "==", sensor.name).get());
                                if (!result.empty) {
                                    constants_27.logger.error(`An sensor of the same name has already existed in the database: "${sensor.name}"`);
                                    return Promise.reject(`400An sensor with the same name "${sensor.name}" has already existed in the database`);
                                }
                                yield firestore.addContentToCollection(constants_28.COMPONENTS_PATH.sensor, sensor);
                            });
                        },
                        read() {
                            return __awaiter(this, void 0, void 0, function* () {
                                let result = yield (0, shorthandOps_2.getRealtimeContent)(constants_28.COMPONENTS_PATH.sensor, "name", {
                                    equalToValue: sensor.name
                                });
                                if (result.match.isNone())
                                    yield realtime.pushContent(sensor, constants_28.COMPONENTS_PATH.sensor);
                            });
                        }
                    },
                    publisher: this.publisher,
                    serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 187"
                }, databaseAddEvent_2.default);
            });
        }
        updateSensor(sensor) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, shorthandOps_2.createWriteEvent)({
                    data: sensor,
                    protectedMethods: {
                        write(currentEvent) {
                            return __awaiter(this, void 0, void 0, function* () {
                                const docs = (yield firestore.queryCollection(constants_28.COMPONENTS_PATH.sensor, collectionRef => collectionRef.where("name", "==", sensor.name).get())).docs;
                                if (docs.length == 0)
                                    return Promise.reject("404Specified name does not match with anything in the database");
                                if (docs.length > 1) {
                                    currentEvent.content.warning = "Ambiguity: There are more than 2 sensors with the same name!";
                                    return Promise.reject("400Could not update sensor details due to ambiguity");
                                }
                                yield firestore.updateDocument(docs[0].id, sensor);
                            });
                        },
                        read() {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield realtime.getContent(constants_28.COMPONENTS_PATH.sensor, (ref) => __awaiter(this, void 0, void 0, function* () {
                                    let isValid = false;
                                    let key = "";
                                    yield ref.orderByChild("name").equalTo(sensor.name).once("child_added", child => {
                                        if (isValid = child.exists())
                                            key = child.key;
                                    });
                                    if (isValid && key) {
                                        realtime.updateContent(sensor, `${constants_28.COMPONENTS_PATH.sensor}/${key}`);
                                        return;
                                    }
                                    Promise.reject(`404Could not find sensor named "${sensor.name}"`);
                                }));
                            });
                        }
                    },
                    publisher: this.publisher,
                    serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 239"
                }, databaseUpdateEvent_2.default);
            });
        }
        addSensorData(sensorName, sensorData) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, shorthandOps_2.createWriteEvent)({
                    data: Object.assign({ sensorName }, sensorData),
                    protectedMethods: {
                        write() {
                            return __awaiter(this, void 0, void 0, function* () {
                                const result = yield firestore.queryCollection(constants_28.COMPONENTS_PATH.sensor, collectionRef => collectionRef.where("name", "==", sensorName).get());
                                if (result.empty)
                                    return Promise.reject("404Specified sensor name does not match with anything in the database");
                                yield firestore.addContentToCollection(constants_28.COMPONENTS_PATH.sensorData, Object.assign({ sensorName }, sensorData));
                            });
                        },
                        read() {
                            return __awaiter(this, void 0, void 0, function* () {
                                let result = yield (0, shorthandOps_2.getRealtimeContent)(constants_28.COMPONENTS_PATH.sensor, "name", {
                                    equalToValue: sensorName
                                });
                                if (result.match.isNone())
                                    return Promise.reject(`404Could not find corresponding sensor name "${sensorName}"`);
                                yield realtime.pushContent(Object.assign({ sensorName }, sensorData), constants_28.COMPONENTS_PATH.sensorData);
                            });
                        }
                    },
                    publisher: this.publisher,
                    serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 194"
                }, databaseAddEvent_2.default);
            });
        }
        deleteSensorData() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, shorthandOps_2.createWriteEvent)({
                    data: {},
                    protectedMethods: {
                        write() {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield firestore.deleteCollection(constants_28.COMPONENTS_PATH.sensorData);
                            });
                        },
                        read() {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield realtime.deleteContent(constants_28.COMPONENTS_PATH.sensorData);
                            });
                        }
                    },
                    publisher: this.publisher,
                    serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 194"
                }, databaseDeleteEvent_2.default);
            });
        }
    }
    exports.default = SensorService;
});
define("src/controller/v1/methods/read/sensorReadMethods", ["require", "exports", "luxon", "tsoa", "src/constants", "src/model/v1/read/sensorDto", "src/controller/v1/services/firebaseFreetier/dataSavingService", "src/controller/v1/services/firebaseFreetier/sensorService"], function (require, exports, luxon_9, tsoa_3, constants_29, sensorDto_2, dataSavingService_3, sensorService_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SensorReadMethods = void 0;
    dataSavingService_3 = __importDefault(dataSavingService_3);
    sensorService_2 = __importDefault(sensorService_2);
    let SensorReadMethods = class SensorReadMethods extends tsoa_3.Controller {
        getSensors(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_29.logger.info("SensorReadMethods: Getting all sensors from the database");
                const option = yield new sensorService_2.default().getSensors();
                return option.unwrapOr([]);
            });
        }
        getCategorizedSensors(accessToken, typeOrName) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_29.logger.info(`SensorReadMethods: Getting categorized sensors from "${typeOrName}"`);
                const sensorService = new sensorService_2.default();
                const sensorsByType = yield sensorService.getSensorsByType(typeOrName);
                return yield sensorsByType.unwrapOrElseAsync(() => __awaiter(this, void 0, void 0, function* () {
                    const sensorByName = yield sensorService.getSensorByName(typeOrName);
                    return [sensorByName.unwrapOrElse(() => {
                            this.setStatus(404);
                            return null;
                        })].filter(x => x != null);
                }));
            });
        }
        getSensorData(accessToken, startDate = 0, endDate = luxon_9.DateTime.now().setZone(constants_29.DATABASE_TIMEZONE).toUnixInteger()) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_29.logger.info(`SensorReadMethods: Getting sensor data from the database from ${startDate} to ${endDate}`);
                const option = yield new sensorService_2.default().getSensorData({ startDate, endDate });
                return option.unwrapOrElse(() => {
                    this.setStatus(404);
                    return [];
                });
            });
        }
        getSensorDataByName(accessToken, name, startDate = 0, endDate = luxon_9.DateTime.now().setZone(constants_29.DATABASE_TIMEZONE).toUnixInteger()) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_29.logger.info(`SensorReadMethods: Getting sensor data from the database with sensor name of "${name}"`);
                const option = yield new sensorService_2.default().getSensorDataByName(name, { startDate, endDate });
                return option.unwrapOrElse(() => {
                    this.setStatus(404);
                    return [];
                });
            });
        }
        getLatestSensorData(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_29.logger.info(`SensorReadMethods: Getting all latest sensor data from the database`);
                const option = yield new sensorService_2.default().getLatestSensorData();
                return option.unwrapOrElse(() => {
                    this.setStatus(404);
                    return [];
                });
            });
        }
        getLatestSensorDataByName(accessToken, name) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_29.logger.info(`SensorReadMethods: Getting latest sensor data from the database with sensor name of "${name}"`);
                const option = yield new sensorService_2.default().getLatestSensorDataByName(name);
                return option.unwrapOrElse(() => {
                    this.setStatus(404);
                    return sensorDto_2.SensorDataDTO.fromJson({});
                });
            });
        }
        getSensorDataRunSnapshot(accessToken, runNumber) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_29.logger.info(`SensorReadMethods: Getting sensor data of the previous run#${runNumber} from the database`);
                const option = yield new dataSavingService_3.default().retrieveSensorSnapshot(runNumber);
                return option.unwrapOrElse(() => {
                    this.setStatus(404);
                    return [];
                });
            });
        }
    };
    __decorate([
        (0, tsoa_3.Get)("get"),
        __param(0, (0, tsoa_3.Query)())
    ], SensorReadMethods.prototype, "getSensors", null);
    __decorate([
        (0, tsoa_3.Get)("{typeOrName}/get"),
        __param(0, (0, tsoa_3.Query)()),
        __param(1, (0, tsoa_3.Path)())
    ], SensorReadMethods.prototype, "getCategorizedSensors", null);
    __decorate([
        (0, tsoa_3.Get)("data/fetchAll"),
        __param(0, (0, tsoa_3.Query)()),
        __param(1, (0, tsoa_3.Query)()),
        __param(2, (0, tsoa_3.Query)())
    ], SensorReadMethods.prototype, "getSensorData", null);
    __decorate([
        (0, tsoa_3.Get)("{name}/data/get"),
        __param(0, (0, tsoa_3.Query)()),
        __param(1, (0, tsoa_3.Path)()),
        __param(2, (0, tsoa_3.Query)()),
        __param(3, (0, tsoa_3.Query)())
    ], SensorReadMethods.prototype, "getSensorDataByName", null);
    __decorate([
        (0, tsoa_3.Get)("data/latest/get"),
        __param(0, (0, tsoa_3.Query)())
    ], SensorReadMethods.prototype, "getLatestSensorData", null);
    __decorate([
        (0, tsoa_3.Get)("{name}/data/latest/get"),
        __param(0, (0, tsoa_3.Query)()),
        __param(1, (0, tsoa_3.Path)())
    ], SensorReadMethods.prototype, "getLatestSensorDataByName", null);
    __decorate([
        (0, tsoa_3.Get)("snapshot/{runNumber}/get"),
        __param(0, (0, tsoa_3.Query)()),
        __param(1, (0, tsoa_3.Path)())
    ], SensorReadMethods.prototype, "getSensorDataRunSnapshot", null);
    SensorReadMethods = __decorate([
        (0, tsoa_3.Security)("api_key"),
        (0, tsoa_3.Route)(`api/v1/sensor`),
        (0, tsoa_3.SuccessResponse)(200, "Ok"),
        (0, tsoa_3.Response)(403, "Forbidden"),
        (0, tsoa_3.Response)(404, "Not Found"),
        (0, tsoa_3.Response)(408, "Request Timeout")
    ], SensorReadMethods);
    exports.SensorReadMethods = SensorReadMethods;
});
define("src/model/v1/read/systemCommandDto", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SystemCommandDTO = void 0;
    class SystemCommandDTO {
        constructor(isStart, isPause, isStop, isRestart) {
            this.isStart = isStart;
            this.isPause = isPause;
            this.isStop = isStop;
            this.isRestart = isRestart;
        }
        toJson() {
            return {
                isStart: this.isStart,
                isPause: this.isPause,
                isStop: this.isStop,
                isRestart: this.isRestart
            };
        }
        static fromJson(commandJson) {
            return new SystemCommandDTO(commandJson && typeof (commandJson.start) === 'boolean' ? commandJson.start : false, commandJson && typeof (commandJson.pause) === 'boolean' ? commandJson.pause : false, commandJson && typeof (commandJson.stop) === 'boolean' ? commandJson.stop : false, commandJson && typeof (commandJson.restart) === 'boolean' ? commandJson.restart : false);
        }
    }
    exports.SystemCommandDTO = SystemCommandDTO;
});
define("src/model/v1/write/systemCommand", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/controller/v1/services/firebaseFreetier/utility/systemCommandService", ["require", "exports", "luxon", "src/constants", "src/model/v1/events/databaseErrorEvent", "src/utility/helper", "src/controller/v1/services/firebaseFreetier/firebaseService", "src/controller/v1/services/firebaseFreetier/sensorService", "src/controller/v1/services/firebaseFreetier/utility/dataSavingService"], function (require, exports, luxon_10, constants_30, databaseErrorEvent_5, helper_3, firebaseService_6, sensorService_3, dataSavingService_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.realtimeSaveSensorSnapshot = exports.realtimeToggleFlag = exports.firestoreToggleFlag = exports.realtimeUploadFlags = exports.firestoreUploadFlags = void 0;
    databaseErrorEvent_5 = __importDefault(databaseErrorEvent_5);
    sensorService_3 = __importDefault(sensorService_3);
    const realtime = firebaseService_6.persistentFirebaseConnection.realtimeService;
    const firestore = firebaseService_6.persistentFirebaseConnection.firestoreService;
    function firestoreUploadFlags(flags, isProposed = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield firestore.runTransaction(constants_30.COMPONENTS_PATH.systemCommand, (snapshot, t) => __awaiter(this, void 0, void 0, function* () {
                t.set(snapshot.ref, flags);
            }));
        });
    }
    exports.firestoreUploadFlags = firestoreUploadFlags;
    function realtimeUploadFlags(flags, isProposed = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield realtime.runTransaction(() => flags, constants_30.COMPONENTS_PATH.systemCommand);
        });
    }
    exports.realtimeUploadFlags = realtimeUploadFlags;
    function firestoreToggleFlag(field) {
        return __awaiter(this, void 0, void 0, function* () {
            const flags = {
                start: false,
                stop: false,
                restart: false,
                pause: false
            };
            flags[field] = true;
            return yield firestoreUploadFlags(flags, true);
        });
    }
    exports.firestoreToggleFlag = firestoreToggleFlag;
    function realtimeToggleFlag(field) {
        return __awaiter(this, void 0, void 0, function* () {
            const flags = {
                start: false,
                stop: false,
                restart: false,
                pause: false
            };
            flags[field] = true;
            return realtimeUploadFlags(flags, true);
        });
    }
    exports.realtimeToggleFlag = realtimeToggleFlag;
    function realtimeSaveSensorSnapshot(publisher) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = yield realtime.getContent(constants_30.COMPONENTS_PATH.count.run);
            const runCount = ref.exists() ? parseInt(ref.val()) : 1;
            const folderName = `${constants_30.COMPONENTS_PATH.storage.sensor}/run${runCount}`;
            const sensorService = new sensorService_3.default();
            const sensorEvent = yield (0, dataSavingService_4.uploadSnapshot)((yield sensorService.getSensors()).unwrapOr([]).sort((0, helper_3.orderByProp)("name")), { startDate: -1, endDate: -1 }, folderName, publisher, 65);
            if (sensorEvent instanceof databaseErrorEvent_5.default)
                Promise.reject("500Could not process upload data event. Please try again!");
            let currentTimestamp = luxon_10.DateTime.now().toUnixInteger();
            while (true) {
                const dateRange = {
                    startDate: currentTimestamp - 3600 * 24,
                    endDate: currentTimestamp
                };
                const oneDayData = (yield sensorService.getSensorData(dateRange)).unwrapOr([]);
                if (!oneDayData.length)
                    break;
                let count = 0;
                while (count !== 3) {
                    const event = yield (0, dataSavingService_4.uploadSnapshot)(oneDayData, dateRange, folderName, publisher, 82);
                    if (event instanceof databaseErrorEvent_5.default) {
                        count++;
                        continue;
                    }
                }
                if (count == 3)
                    Promise.reject("500Could not process upload data event. Please try again!");
                currentTimestamp -= 3600 * 24;
            }
            yield realtime.updateContent(runCount + 1, constants_30.COMPONENTS_PATH.count.run);
        });
    }
    exports.realtimeSaveSensorSnapshot = realtimeSaveSensorSnapshot;
});
define("src/controller/v1/services/firebaseFreetier/systemCommandService", ["require", "exports", "src/controller/v1/services/firebaseFreetier/firebaseService", "src/model/patterns/option", "src/model/v1/events/databaseUpdateEvent", "src/utility/shorthandOps", "src/model/v1/read/systemCommandDto", "src/constants", "src/controller/v1/services/firebaseFreetier/utility/systemCommandService", "src/constants"], function (require, exports, firebaseService_7, option_9, databaseUpdateEvent_3, shorthandOps_3, systemCommandDto_1, constants_31, systemCommandService_1, constants_32) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseUpdateEvent_3 = __importDefault(databaseUpdateEvent_3);
    const realtime = firebaseService_7.persistentFirebaseConnection.realtimeService;
    const firestore = firebaseService_7.persistentFirebaseConnection.firestoreService;
    class SystemCommandService {
        constructor(publisher) {
            this.publisher = publisher;
        }
        toggleFlag(flag) {
            return (0, shorthandOps_3.createWriteEvent)({
                data: { [flag]: true },
                protectedMethods: {
                    write() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield (0, systemCommandService_1.firestoreToggleFlag)(flag);
                        });
                    },
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield (0, systemCommandService_1.realtimeToggleFlag)(flag);
                        });
                    }
                },
                publisher: this.publisher,
                serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 52"
            }, databaseUpdateEvent_3.default);
        }
        setStartSystem() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.toggleFlag("start");
            });
        }
        setPauseSystem() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.toggleFlag("pause");
            });
        }
        setStopSystem() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.toggleFlag("stop");
            });
        }
        setRestartSystem() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.toggleFlag("restart");
            });
        }
        uploadHardwareSystemFlags(flags) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, shorthandOps_3.createWriteEvent)({
                    data: { isRestarted: true },
                    protectedMethods: {
                        write() {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield (0, systemCommandService_1.firestoreUploadFlags)(flags);
                                if (flags.start)
                                    yield firestore.deleteCollection("sensors");
                            });
                        },
                        read() {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield (0, systemCommandService_1.realtimeUploadFlags)(flags);
                                if (flags.start)
                                    yield (0, systemCommandService_1.realtimeSaveSensorSnapshot)(this.publisher);
                            });
                        }
                    },
                    publisher: this.publisher,
                    serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 104"
                }, databaseUpdateEvent_3.default);
            });
        }
        getSystemFlags() {
            return __awaiter(this, void 0, void 0, function* () {
                const snapshot = yield realtime.getContent(constants_32.COMPONENTS_PATH.systemCommand);
                const flags = yield snapshot.val();
                try {
                    return flags ? (0, option_9.Some)(systemCommandDto_1.SystemCommandDTO.fromJson(flags)) : option_9.None;
                }
                catch (e) {
                    constants_31.logger.error("SystemCommandService - Caught an error while getting system flags: " + e);
                    return option_9.None;
                }
            });
        }
        getProposedSystemFlags() {
            return __awaiter(this, void 0, void 0, function* () {
                const snapshot = yield realtime.getContent(constants_32.COMPONENTS_PATH.systemCommandProposed);
                const flags = yield snapshot.val();
                try {
                    return flags ? (0, option_9.Some)(systemCommandDto_1.SystemCommandDTO.fromJson(flags)) : option_9.None;
                }
                catch (e) {
                    constants_31.logger.error("SystemCommandService - Caught an error while getting system flags: " + e);
                    return option_9.None;
                }
            });
        }
    }
    exports.default = SystemCommandService;
});
define("src/controller/v1/methods/read/systemCommandReadMethods", ["require", "exports", "tsoa", "src/constants", "src/controller/v1/services/firebaseFreetier/systemCommandService"], function (require, exports, tsoa_4, constants_33, systemCommandService_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SystemCommandReadMethods = void 0;
    systemCommandService_2 = __importDefault(systemCommandService_2);
    let SystemCommandReadMethods = class SystemCommandReadMethods extends tsoa_4.Controller {
        getSystemCommands(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_33.logger.info("SystemCommandReadMethods: Getting system commands from the database");
                const option = yield new systemCommandService_2.default().getSystemFlags();
                return option.unwrapOrElse(() => {
                    constants_33.logger.error("SystemCommandReadMethods - Something happened to either the code or the database");
                    throw new Error("Internal error");
                });
            });
        }
        getProposedSystemCommands(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_33.logger.info("SystemCommandReadMethods: Getting proposed system commands from the database");
                const option = yield new systemCommandService_2.default().getProposedSystemFlags();
                return option.unwrapOrElse(() => {
                    constants_33.logger.error("SystemCommandReadMethods - Something happened to either the code or the database");
                    throw new Error("Internal error");
                });
            });
        }
    };
    __decorate([
        (0, tsoa_4.Get)("get"),
        __param(0, (0, tsoa_4.Query)())
    ], SystemCommandReadMethods.prototype, "getSystemCommands", null);
    __decorate([
        (0, tsoa_4.Get)("proposed/get"),
        __param(0, (0, tsoa_4.Query)())
    ], SystemCommandReadMethods.prototype, "getProposedSystemCommands", null);
    SystemCommandReadMethods = __decorate([
        (0, tsoa_4.Security)("api_key"),
        (0, tsoa_4.Route)(`api/v1/systemCommand`),
        (0, tsoa_4.SuccessResponse)(200, "Ok"),
        (0, tsoa_4.Response)(403, "Forbidden"),
        (0, tsoa_4.Response)(404, "Not Found"),
        (0, tsoa_4.Response)(408, "Request Timeout")
    ], SystemCommandReadMethods);
    exports.SystemCommandReadMethods = SystemCommandReadMethods;
});
define("src/model/v1/read/systemLogDto", ["require", "exports", "luxon", "src/constants"], function (require, exports, luxon_11, constants_34) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogDTO = void 0;
    class LogDTO {
        constructor(logContent, timeStamp) {
            this.timeStamp = timeStamp;
            this.logContent = logContent;
        }
        toJson() {
            return {
                timeStamp: this.timeStamp,
                logContent: this.logContent
            };
        }
        static fromJson(logJson) {
            const unixNow = luxon_11.DateTime.now().setZone(constants_34.DATABASE_TIMEZONE).toUnixInteger();
            return new LogDTO(typeof (logJson.logContent) === 'string' ? logJson.logContent : "", typeof (logJson.timeStamp) === 'number' ? logJson.timeStamp : unixNow);
        }
    }
    exports.LogDTO = LogDTO;
});
define("src/model/v1/write/systemLog", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/controller/v1/services/firebaseFreetier/counterService", ["require", "exports", "src/controller/v1/services/firebaseFreetier/firebaseService", "src/constants"], function (require, exports, firebaseService_8, constants_35) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const realtime = firebaseService_8.persistentFirebaseConnection.realtimeService;
    class CounterService {
        constructor() { }
        incrementLogCounter(whichCounter, by = 1, maxCounter = constants_35.LOG_LINES) {
            return __awaiter(this, void 0, void 0, function* () {
                let count = -1;
                yield realtime.getContent(`${constants_35.COMPONENTS_PATH.count.path}/${whichCounter}`, (ref) => __awaiter(this, void 0, void 0, function* () {
                    count = (yield ref.transaction(val => {
                        if (typeof (val) !== 'number')
                            return 1;
                        if (val < maxCounter)
                            return val + by;
                        return val;
                    })).snapshot.val();
                }));
                return count;
            });
        }
        resetLogCounter(whichCounter, to = 1) {
            return __awaiter(this, void 0, void 0, function* () {
                let count = -1;
                yield realtime.getContent(`${constants_35.COMPONENTS_PATH.count.path}/${whichCounter}`, (ref) => __awaiter(this, void 0, void 0, function* () {
                    count = (yield ref.transaction(_ => to)).snapshot.val();
                }));
                return count;
            });
        }
        incrementSystemRunCounter() {
            return __awaiter(this, void 0, void 0, function* () {
                let count = -1;
                yield realtime.getContent(`${constants_35.COMPONENTS_PATH.count.run}`, (ref) => __awaiter(this, void 0, void 0, function* () {
                    const transaction = yield ref.transaction(val => typeof (val) !== 'number' ? 1 : val + 1);
                    count = transaction.snapshot.val();
                }));
                return count;
            });
        }
    }
    exports.default = CounterService;
});
define("src/controller/v1/services/firebaseFreetier/utility/systemLogsService", ["require", "exports", "luxon", "src/constants", "src/model/v1/events/databaseAddEvent", "src/utility/shorthandOps", "src/controller/database/firebase/services/firebaseRealtimeService", "src/controller/v1/services/firebaseFreetier/counterService", "src/controller/v1/services/firebaseFreetier/dataSavingService", "src/controller/v1/services/firebaseFreetier/firebaseService"], function (require, exports, luxon_12, constants_36, databaseAddEvent_3, shorthandOps_4, firebaseRealtimeService_4, counterService_1, dataSavingService_5, firebaseService_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLog = exports.pushLog = void 0;
    databaseAddEvent_3 = __importDefault(databaseAddEvent_3);
    counterService_1 = __importDefault(counterService_1);
    dataSavingService_5 = __importDefault(dataSavingService_5);
    const realtime = firebaseService_9.persistentFirebaseConnection.realtimeService;
    const firestore = firebaseService_9.persistentFirebaseConnection.firestoreService;
    const pushLog = (path, log, publisher) => __awaiter(void 0, void 0, void 0, function* () {
        log.timeStamp = log.timeStamp || luxon_12.DateTime.now().setZone(constants_36.DATABASE_TIMEZONE).toUnixInteger();
        return yield (0, shorthandOps_4.createWriteEvent)({
            data: log,
            protectedMethods: {
                write() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const collectionPath = path;
                        yield firestore.addContentToCollection(`${collectionPath}/content`, log);
                    });
                },
                read() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const count = yield new counterService_1.default().incrementLogCounter(path);
                        if (count >= constants_36.LOG_LINES)
                            yield realtime.getContent(path, (ref) => __awaiter(this, void 0, void 0, function* () {
                                const temp = yield (0, firebaseRealtimeService_4.getQueryResult)(ref.orderByChild("timeStamp").limitToFirst(1));
                                for (const key in temp)
                                    yield realtime.deleteContent(`${path}/${key}`);
                            }));
                        yield realtime.pushContent(log, path);
                    });
                }
            },
            publisher,
            serverLogErrorMsg: "SystemLogsService: DatabaseEvent filtration leads to all error ~ 63"
        }, databaseAddEvent_3.default);
    });
    exports.pushLog = pushLog;
    const getLog = (oldestTimestamp, path) => __awaiter(void 0, void 0, void 0, function* () {
        const dataSavingService = new dataSavingService_5.default();
        let result = (yield dataSavingService.retrieveActuatorLogSnapshots({
            startDate: oldestTimestamp
        })).unwrapOr([]);
        yield realtime.getContent(path, (ref) => __awaiter(void 0, void 0, void 0, function* () {
            const temp = (yield (0, firebaseRealtimeService_4.getQueryResultAsArray)(ref.orderByChild("timeStamp").limitToLast(constants_36.LOG_LINES), json => json.timeStamp >= oldestTimestamp)).unwrapOr([]);
            const len = temp.length;
            if (len < constants_36.LOG_LINES)
                result = result.slice(result.length - constants_36.LOG_LINES + len).concat(temp);
            else
                result = temp;
        }));
        return result;
    });
    exports.getLog = getLog;
});
define("src/controller/v1/services/firebaseFreetier/systemLogsService", ["require", "exports", "src/constants", "src/model/v1/read/systemLogDto", "src/model/patterns/option", "src/constants", "src/controller/v1/services/firebaseFreetier/utility/systemLogsService"], function (require, exports, constants_37, systemLogDto_1, option_10, constants_38, systemLogsService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SystemLogsService {
        constructor(publisher) {
            this.publisher = publisher;
        }
        getSensorLogs(oldestTimestamp = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield (0, systemLogsService_1.getLog)(oldestTimestamp, constants_38.COMPONENTS_PATH.logs.sensor);
                constants_37.logger.debug(`All logs: ${result}`);
                return result.length ? (0, option_10.Some)(result.map(json => systemLogDto_1.LogDTO.fromJson(json))) : option_10.None;
            });
        }
        getActuatorLogs(oldestTimestamp = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield (0, systemLogsService_1.getLog)(oldestTimestamp, constants_38.COMPONENTS_PATH.logs.actuator);
                constants_37.logger.debug(`All logs: ${result}`);
                return result.length ? (0, option_10.Some)(result.map(json => systemLogDto_1.LogDTO.fromJson(json))) : option_10.None;
            });
        }
        getSystemCommandLogs(oldestTimestamp = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield (0, systemLogsService_1.getLog)(oldestTimestamp, constants_38.COMPONENTS_PATH.logs.systemCommand);
                constants_37.logger.debug(`All logs: ${result}`);
                return result.length ? (0, option_10.Some)(result.map(json => systemLogDto_1.LogDTO.fromJson(json))) : option_10.None;
            });
        }
        addSensorLog(log) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, systemLogsService_1.pushLog)(constants_38.COMPONENTS_PATH.logs.sensor, log, this.publisher);
            });
        }
        addActuatorLog(log) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, systemLogsService_1.pushLog)(constants_38.COMPONENTS_PATH.logs.actuator, log, this.publisher);
            });
        }
        addSystemCommandLog(log) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, systemLogsService_1.pushLog)(constants_38.COMPONENTS_PATH.logs.systemCommand, log, this.publisher);
            });
        }
    }
    exports.default = SystemLogsService;
});
define("src/controller/v1/methods/read/systemLogsReadMethods", ["require", "exports", "tsoa", "src/constants", "src/controller/v1/services/firebaseFreetier/systemLogsService"], function (require, exports, tsoa_5, constants_39, systemLogsService_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SystemLogsReadMethods = void 0;
    systemLogsService_2 = __importDefault(systemLogsService_2);
    let SystemLogsReadMethods = class SystemLogsReadMethods extends tsoa_5.Controller {
        getSensorLogs(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_39.logger.info("SystemLogsReadMethods: Getting sensor logs from the database");
                return (yield new systemLogsService_2.default().getSensorLogs()).unwrapOrElse(() => {
                    this.setStatus(408);
                    return [];
                });
            });
        }
        getActuatorLogs(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_39.logger.info("SystemLogsReadMethods: Getting actuator logs from the database");
                return (yield new systemLogsService_2.default().getActuatorLogs()).unwrapOrElse(() => {
                    this.setStatus(408);
                    return [];
                });
            });
        }
        getSystemCommandLogs(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_39.logger.info("SystemLogsReadMethods: Getting system command logs from the database");
                return (yield new systemLogsService_2.default().getSystemCommandLogs()).unwrapOrElse(() => {
                    this.setStatus(408);
                    return [];
                });
            });
        }
    };
    __decorate([
        (0, tsoa_5.Get)("sensor/get"),
        __param(0, (0, tsoa_5.Query)())
    ], SystemLogsReadMethods.prototype, "getSensorLogs", null);
    __decorate([
        (0, tsoa_5.Get)("actuator/get"),
        __param(0, (0, tsoa_5.Query)())
    ], SystemLogsReadMethods.prototype, "getActuatorLogs", null);
    __decorate([
        (0, tsoa_5.Get)("systemCommand/get"),
        __param(0, (0, tsoa_5.Query)())
    ], SystemLogsReadMethods.prototype, "getSystemCommandLogs", null);
    SystemLogsReadMethods = __decorate([
        (0, tsoa_5.Security)("api_key"),
        (0, tsoa_5.Route)(`api/v1/log`),
        (0, tsoa_5.SuccessResponse)(200, "Ok"),
        (0, tsoa_5.Response)("403", "Forbidden"),
        (0, tsoa_5.Response)("408", "Request Timeout")
    ], SystemLogsReadMethods);
    exports.SystemLogsReadMethods = SystemLogsReadMethods;
});
define("src/controller/v1/methods/write/actuatorWriteMethods", ["require", "exports", "tsoa", "src/constants", "src/model/v1/events/databaseEvent", "src/model/v1/events/databaseErrorEvent"], function (require, exports, tsoa_6, constants_40, databaseEvent_6, databaseErrorEvent_6) {
    "use strict";
    var ActuatorWriteMethods_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActuatorWriteMethods = void 0;
    databaseEvent_6 = __importDefault(databaseEvent_6);
    databaseErrorEvent_6 = __importDefault(databaseErrorEvent_6);
    const getEvent = databaseEvent_6.default.getCompactEvent;
    let ActuatorWriteMethods = ActuatorWriteMethods_1 = class ActuatorWriteMethods extends tsoa_6.Controller {
        constructor() {
            super();
            this.service = ActuatorWriteMethods_1.mainService;
        }
        addActuator(accessToken, actuator) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_40.logger.info(`ActuatorWriteMethods: Adding actuator "${actuator.name}" to the database`);
                const event = yield this.service.addActuator(actuator);
                if (event instanceof databaseErrorEvent_6.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
        updateActuator(accessToken, actuator) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_40.logger.info(`ActuatorWriteMethods: Updating actuator "${actuator.name}" information in the database`);
                const event = yield this.service.updateActuator(actuator);
                if (event instanceof databaseErrorEvent_6.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
        updateActuatorConfig(accessToken, actuatorName, actuatorConfig) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_40.logger.info(`ActuatorWriteMethods: Updating config for actuator "${actuatorName}"`);
                const event = yield this.service.updateActuatorConfig(actuatorName, actuatorConfig);
                if (event instanceof databaseErrorEvent_6.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
        updateProposedActuatorConfig(accessToken, actuatorName, actuatorConfig) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_40.logger.info(`ActuatorWriteMethods: Updating config for actuator "${actuatorName}"`);
                const event = yield this.service.updateProposedActuatorConfig(actuatorName, actuatorConfig);
                if (event instanceof databaseErrorEvent_6.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
    };
    __decorate([
        (0, tsoa_6.Post)("add"),
        __param(0, (0, tsoa_6.Query)()),
        __param(1, (0, tsoa_6.BodyProp)())
    ], ActuatorWriteMethods.prototype, "addActuator", null);
    __decorate([
        (0, tsoa_6.Patch)("update"),
        __param(0, (0, tsoa_6.Query)()),
        __param(1, (0, tsoa_6.BodyProp)())
    ], ActuatorWriteMethods.prototype, "updateActuator", null);
    __decorate([
        (0, tsoa_6.Post)("{actuatorName}/config/update"),
        __param(0, (0, tsoa_6.Query)()),
        __param(1, (0, tsoa_6.Path)()),
        __param(2, (0, tsoa_6.BodyProp)())
    ], ActuatorWriteMethods.prototype, "updateActuatorConfig", null);
    __decorate([
        (0, tsoa_6.Patch)("{actuatorName}/config/proposed/update"),
        __param(0, (0, tsoa_6.Query)()),
        __param(1, (0, tsoa_6.Path)()),
        __param(2, (0, tsoa_6.BodyProp)())
    ], ActuatorWriteMethods.prototype, "updateProposedActuatorConfig", null);
    ActuatorWriteMethods = ActuatorWriteMethods_1 = __decorate([
        (0, tsoa_6.Security)("api_key"),
        (0, tsoa_6.Route)(`api/v1/actuator`),
        (0, tsoa_6.SuccessResponse)(200, "Ok"),
        (0, tsoa_6.Response)(400, "Bad Request"),
        (0, tsoa_6.Response)(401, "Unauthorized"),
        (0, tsoa_6.Response)(403, "Forbidden"),
        (0, tsoa_6.Response)(404, "Not Found"),
        (0, tsoa_6.Response)(408, "Request Timeout")
    ], ActuatorWriteMethods);
    exports.ActuatorWriteMethods = ActuatorWriteMethods;
});
define("src/controller/v1/methods/write/dataSavingWriteMethods", ["require", "exports", "tsoa", "src/constants", "src/model/v1/events/databaseEvent", "src/model/v1/events/databaseErrorEvent", "src/controller/v1/services/firebaseFreetier/sensorService", "src/controller/v1/services/firebaseFreetier/counterService"], function (require, exports, tsoa_7, constants_41, databaseEvent_7, databaseErrorEvent_7, sensorService_4, counterService_2) {
    "use strict";
    var DataSavingWriteMethods_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataSavingWriteMethods = void 0;
    databaseEvent_7 = __importDefault(databaseEvent_7);
    databaseErrorEvent_7 = __importDefault(databaseErrorEvent_7);
    sensorService_4 = __importDefault(sensorService_4);
    counterService_2 = __importDefault(counterService_2);
    const getEvent = databaseEvent_7.default.getCompactEvent;
    let DataSavingWriteMethods = DataSavingWriteMethods_1 = class DataSavingWriteMethods extends tsoa_7.Controller {
        constructor() {
            super();
            this.service = DataSavingWriteMethods_1.mainService;
        }
        deleteSensorSnapshot(accessToken, runNumber) {
            return __awaiter(this, void 0, void 0, function* () {
                const event = yield this.service.deleteSensorSnapshot(runNumber);
                if (event instanceof databaseErrorEvent_7.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
        saveSensorSnapshot(accessToken) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_41.logger.info(`DataSavingWriteMethods: Saving sensor snapshot to the storage`);
                const sensorService = new sensorService_4.default();
                const counterService = new counterService_2.default();
                const snapshot = yield sensorService.getSensorDataSnapshot();
                let event = yield this.service.uploadSensorSnapshot({
                    sensor: (yield sensorService.getSensors()).unwrapOr([]),
                    data: snapshot.unwrapOr([])
                }, yield counterService.incrementSystemRunCounter());
                if (process.env.NODE_ENV === 'production'
                    && !(event instanceof databaseErrorEvent_7.default)) {
                    try {
                        let count = 0;
                        while (count++ < 3) {
                            const deleteEvent = yield sensorService.deleteSensorData();
                            if (deleteEvent instanceof databaseErrorEvent_7.default) {
                                continue;
                            }
                            else
                                break;
                        }
                    }
                    finally {
                    }
                }
                if (event instanceof databaseErrorEvent_7.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
    };
    __decorate([
        (0, tsoa_7.Patch)("sensor/{runNumber}/delete"),
        __param(0, (0, tsoa_7.Query)()),
        __param(1, (0, tsoa_7.Path)())
    ], DataSavingWriteMethods.prototype, "deleteSensorSnapshot", null);
    __decorate([
        (0, tsoa_7.Post)("sensor/save"),
        __param(0, (0, tsoa_7.Query)())
    ], DataSavingWriteMethods.prototype, "saveSensorSnapshot", null);
    DataSavingWriteMethods = DataSavingWriteMethods_1 = __decorate([
        (0, tsoa_7.Security)("api_key"),
        (0, tsoa_7.Route)(`api/v1/snapshot`),
        (0, tsoa_7.SuccessResponse)(200, "Ok"),
        (0, tsoa_7.Response)(400, "Bad Request"),
        (0, tsoa_7.Response)(401, "Unauthorized"),
        (0, tsoa_7.Response)(403, "Forbidden"),
        (0, tsoa_7.Response)(404, "Not Found"),
        (0, tsoa_7.Response)(408, "Request Timeout")
    ], DataSavingWriteMethods);
    exports.DataSavingWriteMethods = DataSavingWriteMethods;
});
define("src/controller/v1/methods/write/sensorWriteMethods", ["require", "exports", "tsoa", "src/constants", "src/model/v1/events/databaseEvent", "src/model/v1/events/databaseErrorEvent"], function (require, exports, tsoa_8, constants_42, databaseEvent_8, databaseErrorEvent_8) {
    "use strict";
    var SensorWriteMethods_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SensorWriteMethods = void 0;
    databaseEvent_8 = __importDefault(databaseEvent_8);
    databaseErrorEvent_8 = __importDefault(databaseErrorEvent_8);
    const getEvent = databaseEvent_8.default.getCompactEvent;
    let SensorWriteMethods = SensorWriteMethods_1 = class SensorWriteMethods extends tsoa_8.Controller {
        constructor() {
            super();
            this.service = SensorWriteMethods_1.mainService;
        }
        addSensor(accessToken, sensor) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_42.logger.info(`SensorWriteMethods: Adding sensor "${sensor.name}" to the database`);
                const event = yield this.service.addSensor(sensor);
                if (event instanceof databaseErrorEvent_8.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
        updateSensor(accessToken, sensor) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_42.logger.info(`SensorWriteMethods: Updating sensor "${sensor.name}" in the database`);
                const event = yield this.service.updateSensor(sensor);
                if (event instanceof databaseErrorEvent_8.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
        addSensorData(accessToken, sensorName, sensorData) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_42.logger.info(`SensorWriteMethods: Adding sensor data with sensor name "${sensorName}" to the database`);
                const event = yield this.service.addSensorData(sensorName, sensorData);
                if (event instanceof databaseErrorEvent_8.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
    };
    __decorate([
        (0, tsoa_8.Post)("add"),
        __param(0, (0, tsoa_8.Query)()),
        __param(1, (0, tsoa_8.BodyProp)())
    ], SensorWriteMethods.prototype, "addSensor", null);
    __decorate([
        (0, tsoa_8.Patch)("update"),
        __param(0, (0, tsoa_8.Query)()),
        __param(1, (0, tsoa_8.BodyProp)())
    ], SensorWriteMethods.prototype, "updateSensor", null);
    __decorate([
        (0, tsoa_8.Post)("{sensorName}/data/add"),
        __param(0, (0, tsoa_8.Query)()),
        __param(1, (0, tsoa_8.Path)()),
        __param(2, (0, tsoa_8.BodyProp)())
    ], SensorWriteMethods.prototype, "addSensorData", null);
    SensorWriteMethods = SensorWriteMethods_1 = __decorate([
        (0, tsoa_8.Security)("api_key"),
        (0, tsoa_8.Route)(`api/v1/sensor`),
        (0, tsoa_8.SuccessResponse)(200, "Ok"),
        (0, tsoa_8.Response)(400, "Bad Request"),
        (0, tsoa_8.Response)(401, "Unauthorized"),
        (0, tsoa_8.Response)(403, "Forbidden"),
        (0, tsoa_8.Response)(404, "Not Found"),
        (0, tsoa_8.Response)(408, "Request Timeout")
    ], SensorWriteMethods);
    exports.SensorWriteMethods = SensorWriteMethods;
});
define("src/controller/v1/methods/write/systemCommandWriteMethods", ["require", "exports", "tsoa"], function (require, exports, tsoa_9) {
    "use strict";
    var SystemCommandWriteMethods_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SystemCommandWriteMethods = void 0;
    let SystemCommandWriteMethods = SystemCommandWriteMethods_1 = class SystemCommandWriteMethods extends tsoa_9.Controller {
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
        commitSystemFlags(accessToken, flags) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.service.uploadHardwareSystemFlags(flags);
            });
        }
    };
    __decorate([
        (0, tsoa_9.Post)("startSystem"),
        __param(0, (0, tsoa_9.Query)())
    ], SystemCommandWriteMethods.prototype, "startSystem", null);
    __decorate([
        (0, tsoa_9.Post)("pauseSystem"),
        __param(0, (0, tsoa_9.Query)())
    ], SystemCommandWriteMethods.prototype, "pauseSystem", null);
    __decorate([
        (0, tsoa_9.Post)("stopSystem"),
        __param(0, (0, tsoa_9.Query)())
    ], SystemCommandWriteMethods.prototype, "stopSystem", null);
    __decorate([
        (0, tsoa_9.Post)("restartSystem"),
        __param(0, (0, tsoa_9.Query)())
    ], SystemCommandWriteMethods.prototype, "restartSystem", null);
    __decorate([
        (0, tsoa_9.Post)("flags/commit"),
        __param(0, (0, tsoa_9.Query)()),
        __param(1, (0, tsoa_9.BodyProp)())
    ], SystemCommandWriteMethods.prototype, "commitSystemFlags", null);
    SystemCommandWriteMethods = SystemCommandWriteMethods_1 = __decorate([
        (0, tsoa_9.Security)("api_key"),
        (0, tsoa_9.Route)(`api/v1/systemCommand`),
        (0, tsoa_9.SuccessResponse)(200, "Ok"),
        (0, tsoa_9.Response)(403, "Forbidden"),
        (0, tsoa_9.Response)(404, "Not Found"),
        (0, tsoa_9.Response)(408, "Request Timeout")
    ], SystemCommandWriteMethods);
    exports.SystemCommandWriteMethods = SystemCommandWriteMethods;
});
define("src/controller/v1/methods/write/systemLogsWriteMethods", ["require", "exports", "tsoa", "src/model/v1/events/databaseEvent", "src/constants", "src/model/v1/events/databaseErrorEvent"], function (require, exports, tsoa_10, databaseEvent_9, constants_43, databaseErrorEvent_9) {
    "use strict";
    var SystemLogsWriteMethods_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SystemLogsWriteMethods = void 0;
    databaseEvent_9 = __importDefault(databaseEvent_9);
    databaseErrorEvent_9 = __importDefault(databaseErrorEvent_9);
    const getEvent = databaseEvent_9.default.getCompactEvent;
    let SystemLogsWriteMethods = SystemLogsWriteMethods_1 = class SystemLogsWriteMethods extends tsoa_10.Controller {
        constructor() {
            super();
            this.service = SystemLogsWriteMethods_1.mainService;
        }
        addSensorLog(accessToken, logContent) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_43.logger.info("SystemLogsWriteMethods: Adding sensor log to the database");
                const event = yield this.service.addSensorLog({ logContent });
                if (event instanceof databaseErrorEvent_9.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
        addActuatorLog(accessToken, logContent) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_43.logger.info("SystemLogsWriteMethods: Adding actuator log to the database");
                const event = yield this.service.addActuatorLog({ logContent });
                if (event instanceof databaseErrorEvent_9.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
        addSystemCommandLog(accessToken, logContent) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_43.logger.info("SystemLogsWriteMethods: Adding system command log to the database");
                const event = yield this.service.addSystemCommandLog({ logContent });
                if (event instanceof databaseErrorEvent_9.default) {
                    this.setStatus(event.content.values.statusCode);
                }
                return getEvent(event);
            });
        }
    };
    __decorate([
        (0, tsoa_10.Post)("sensor/add"),
        __param(0, (0, tsoa_10.Query)()),
        __param(1, (0, tsoa_10.BodyProp)())
    ], SystemLogsWriteMethods.prototype, "addSensorLog", null);
    __decorate([
        (0, tsoa_10.Post)("actuator/add"),
        __param(0, (0, tsoa_10.Query)()),
        __param(1, (0, tsoa_10.BodyProp)())
    ], SystemLogsWriteMethods.prototype, "addActuatorLog", null);
    __decorate([
        (0, tsoa_10.Post)("systemCommand/add"),
        __param(0, (0, tsoa_10.Query)()),
        __param(1, (0, tsoa_10.BodyProp)())
    ], SystemLogsWriteMethods.prototype, "addSystemCommandLog", null);
    SystemLogsWriteMethods = SystemLogsWriteMethods_1 = __decorate([
        (0, tsoa_10.Route)(`api/v1/log`),
        (0, tsoa_10.SuccessResponse)(200, "Ok"),
        (0, tsoa_10.Response)(400, "Bad Request"),
        (0, tsoa_10.Response)(401, "Unauthorized"),
        (0, tsoa_10.Response)(403, "Forbidden"),
        (0, tsoa_10.Response)(404, "Not Found"),
        (0, tsoa_10.Response)(408, "Request Timeout")
    ], SystemLogsWriteMethods);
    exports.SystemLogsWriteMethods = SystemLogsWriteMethods;
});
define("src/controller/security/methods/securityMethods", ["require", "exports", "tsoa", "src/controller/v1/services/firebaseFreetier/firebaseService"], function (require, exports, tsoa_11, firebaseService_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SecurityMethods = void 0;
    const auth = firebaseService_10.persistentFirebaseConnection.authService;
    let SecurityMethods = class SecurityMethods extends tsoa_11.Controller {
        register(email, password) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield auth.registerWithEmail(email, password);
            });
        }
        login(email, password) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield auth.loginWithEmail(email, password);
            });
        }
        refreshLoginCredentials(email, password) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield auth.reauthenticationWithEmail(email, password);
            });
        }
    };
    __decorate([
        (0, tsoa_11.Post)("register"),
        __param(0, (0, tsoa_11.BodyProp)()),
        __param(1, (0, tsoa_11.BodyProp)())
    ], SecurityMethods.prototype, "register", null);
    __decorate([
        (0, tsoa_11.Post)("login"),
        __param(0, (0, tsoa_11.BodyProp)()),
        __param(1, (0, tsoa_11.BodyProp)())
    ], SecurityMethods.prototype, "login", null);
    __decorate([
        (0, tsoa_11.Post)("login/refresh"),
        __param(0, (0, tsoa_11.BodyProp)()),
        __param(1, (0, tsoa_11.BodyProp)())
    ], SecurityMethods.prototype, "refreshLoginCredentials", null);
    SecurityMethods = __decorate([
        (0, tsoa_11.Route)(`api/v1`),
        (0, tsoa_11.SuccessResponse)(200, "Ok"),
        (0, tsoa_11.Response)(403, "Forbidden"),
        (0, tsoa_11.Response)(404, "Not Found"),
        (0, tsoa_11.Response)(408, "Request Timeout")
    ], SecurityMethods);
    exports.SecurityMethods = SecurityMethods;
});
define("src/controller/security/authentication", ["require", "exports", "src/utility/encryption", "src/controller/v1/services/firebaseFreetier/firebaseService"], function (require, exports, encryption_2, firebaseService_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.expressAuthentication = void 0;
    function expressAuthentication(request, securityName, scopes) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (securityName === "api_key") {
                let token = (_a = request.query) === null || _a === void 0 ? void 0 : _a.accessToken;
                if (!token)
                    return Promise.reject({ message: "No authentication token is provided", type: "Security" });
                if (Array.isArray(token))
                    return Promise.reject({
                        message: "Wrong token format - only one token is needed",
                        type: "Security"
                    });
                const unpacked = (0, encryption_2.asymmetricKeyDecryption)(Buffer.from(token.toString(), 'hex')).split('|');
                if (unpacked.length != 2)
                    return Promise.reject({
                        message: "Wrong token format",
                        type: "Security"
                    });
                const [userId, apiKey] = unpacked;
                const service = firebaseService_11.persistentFirebaseConnection.authService;
                return yield service.verifyApiKey(userId, apiKey);
            }
        });
    }
    exports.expressAuthentication = expressAuthentication;
});
define("build/routes", ["require", "exports", "@tsoa/runtime", "src/controller/v1/methods/read/actuatorReadMethods", "src/controller/v1/methods/read/dataSavingReadMethods", "src/controller/v1/methods/read/sensorReadMethods", "src/controller/v1/methods/read/systemCommandReadMethods", "src/controller/v1/methods/read/systemLogsReadMethods", "src/controller/v1/methods/write/actuatorWriteMethods", "src/controller/v1/methods/write/dataSavingWriteMethods", "src/controller/v1/methods/write/sensorWriteMethods", "src/controller/v1/methods/write/systemCommandWriteMethods", "src/controller/v1/methods/write/systemLogsWriteMethods", "src/controller/security/methods/securityMethods", "src/controller/security/authentication"], function (require, exports, runtime_1, actuatorReadMethods_1, dataSavingReadMethods_1, sensorReadMethods_1, systemCommandReadMethods_1, systemLogsReadMethods_1, actuatorWriteMethods_1, dataSavingWriteMethods_1, sensorWriteMethods_1, systemCommandWriteMethods_1, systemLogsWriteMethods_1, securityMethods_1, authentication_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RegisterRoutes = void 0;
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
        "SnapshotDownloadResponse": {
            "dataType": "refObject",
            "properties": {
                "newFileName": { "dataType": "string", "required": true },
                "downloadUrl": { "dataType": "string", "required": true },
                "decompressionByteLength": { "dataType": "double", "required": true },
                "note": { "dataType": "string", "required": true },
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
        app.get('/api/v1/snapshot/sensor/:runNumber/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(dataSavingReadMethods_1.DataSavingReadMethods)), ...((0, runtime_1.fetchMiddlewares)(dataSavingReadMethods_1.DataSavingReadMethods.prototype.retrieveSensorDataRunSnapshot)), function DataSavingReadMethods_retrieveSensorDataRunSnapshot(request, response, next) {
            const args = {
                accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
                runNumber: { "in": "path", "name": "runNumber", "required": true, "dataType": "double" },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
                const controller = new dataSavingReadMethods_1.DataSavingReadMethods();
                const promise = controller.retrieveSensorDataRunSnapshot.apply(controller, validatedArgs);
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
        app.get('/api/v1/sensor/data/latest/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods.prototype.getLatestSensorData)), function SensorReadMethods_getLatestSensorData(request, response, next) {
            const args = {
                accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
                const controller = new sensorReadMethods_1.SensorReadMethods();
                const promise = controller.getLatestSensorData.apply(controller, validatedArgs);
                promiseHandler(controller, promise, response, undefined, next);
            }
            catch (err) {
                return next(err);
            }
        });
        app.get('/api/v1/sensor/:name/data/latest/get', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods)), ...((0, runtime_1.fetchMiddlewares)(sensorReadMethods_1.SensorReadMethods.prototype.getLatestSensorDataByName)), function SensorReadMethods_getLatestSensorDataByName(request, response, next) {
            const args = {
                accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
                name: { "in": "path", "name": "name", "required": true, "dataType": "string" },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
                const controller = new sensorReadMethods_1.SensorReadMethods();
                const promise = controller.getLatestSensorDataByName.apply(controller, validatedArgs);
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
        app.patch('/api/v1/snapshot/sensor/:runNumber/delete', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(dataSavingWriteMethods_1.DataSavingWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(dataSavingWriteMethods_1.DataSavingWriteMethods.prototype.deleteSensorSnapshot)), function DataSavingWriteMethods_deleteSensorSnapshot(request, response, next) {
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
        app.post('/api/v1/snapshot/sensor/save', authenticateMiddleware([{ "api_key": [] }]), ...((0, runtime_1.fetchMiddlewares)(dataSavingWriteMethods_1.DataSavingWriteMethods)), ...((0, runtime_1.fetchMiddlewares)(dataSavingWriteMethods_1.DataSavingWriteMethods.prototype.saveSensorSnapshot)), function DataSavingWriteMethods_saveSensorSnapshot(request, response, next) {
            const args = {
                accessToken: { "in": "query", "name": "accessToken", "required": true, "dataType": "string" },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
                const controller = new dataSavingWriteMethods_1.DataSavingWriteMethods();
                const promise = controller.saveSensorSnapshot.apply(controller, validatedArgs);
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
});
define("src/view/login", ["require", "exports", "express"], function (require, exports, express_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const loginRouter = (0, express_1.Router)()
        .get("/", (req, res) => {
    })
        .post("/", (req, res) => {
    });
    exports.default = loginRouter;
});
define("src/view/user/index", ["require", "exports", "express"], function (require, exports, express_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const router = (0, express_2.Router)();
    const userIndex = router.get("/", (req, res) => {
    });
    exports.default = userIndex;
});
define("src/view/index", ["require", "exports", "express", "src/view/login", "src/view/user/index"], function (require, exports, express_3, login_1, user_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    login_1 = __importDefault(login_1);
    user_2 = __importDefault(user_2);
    const router = (0, express_3.Router)();
    router.use("/user", user_2.default);
    router.use("/login", login_1.default);
    const index = router.get("/", (req, res) => {
        res.send("Hello world");
    });
    exports.default = index;
});
define("src/controller/v1/model/bus/commandBus", ["require", "exports", "src/constants", "src/model/patterns/subscriptionImplementor", "src/model/v1/events/databaseErrorEvent", "src/utility/filterDatabaseEvent"], function (require, exports, constants_44, subscriptionImplementor_1, databaseErrorEvent_10, filterDatabaseEvent_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseErrorEvent_10 = __importDefault(databaseErrorEvent_10);
    class CommandBusSubscriber extends subscriptionImplementor_1.SubscriberImplementor {
        constructor(linkedPublisher) {
            super();
            this.linkedPublisher = linkedPublisher;
        }
        onNextAsync(event) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_44.logger.debug("CommandBus.onNextAsync is called");
                return (0, filterDatabaseEvent_4.filterDatabaseEvent)(yield this.linkedPublisher.notifyAsync(event)).unwrapOrElse(() => {
                    constants_44.logger.error("CommandBus: DatabaseEvent filtration leads to all error");
                    return new databaseErrorEvent_10.default("The action is failed to be executed", 400);
                });
            });
        }
        onNext(event) {
            constants_44.logger.debug("CommandBus.onNext is called");
            super.onNext(event);
            this.linkedPublisher.notify(event);
        }
    }
    class CommandBus extends subscriptionImplementor_1.PublisherImplementor {
        constructor(...publishers) {
            super();
            this.commandBusSubscriber = new CommandBusSubscriber(this);
            publishers.map(publisher => this.commandBusSubscriber.subscribe(publisher));
            constants_44.logger.debug("Initialized CommandBus");
        }
    }
    exports.default = CommandBus;
});
define("src/controller/v1/model/writeModel", ["require", "exports", "src/constants", "src/model/patterns/subscriptionImplementor", "src/model/v1/events/databaseErrorEvent", "src/utility/filterDatabaseEvent"], function (require, exports, constants_45, subscriptionImplementor_2, databaseErrorEvent_11, filterDatabaseEvent_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseErrorEvent_11 = __importDefault(databaseErrorEvent_11);
    class WriteModelSubscriber extends subscriptionImplementor_2.SubscriberImplementor {
        constructor(linkedPublisher) {
            super();
            this.linkedPublisher = linkedPublisher;
        }
        onNextAsync(event) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_45.logger.debug("WriteModel.onNextAsync is called");
                const newEvent = this.linkedPublisher.commitChanges(event);
                if (!(newEvent instanceof databaseErrorEvent_11.default)) {
                    if (!(yield this.retryAsyncNotification(event))) {
                        constants_45.logger.error("Query database (mirror database) encountered problem!");
                        return new databaseErrorEvent_11.default("Database encountered problem. Please try again later", 500);
                    }
                }
                constants_45.logger.info("Added background work for data transaction");
                return newEvent;
            });
        }
        onNext(event) {
            constants_45.logger.debug("WriteModel.onNext is called");
            super.onNext(event);
            Promise.all([this.linkedPublisher.commitChanges(event)]);
            this.linkedPublisher.notify(event);
        }
        retryAsyncNotification(event) {
            return __awaiter(this, void 0, void 0, function* () {
                let childEvents = yield this.linkedPublisher.notifyAsync(event);
                let retry = 3;
                while (retry != 0) {
                    if ((0, filterDatabaseEvent_5.filterDatabaseEvent)(childEvents) instanceof databaseErrorEvent_11.default) {
                        childEvents = yield this.linkedPublisher.notifyAsync(event);
                        retry--;
                        continue;
                    }
                    break;
                }
                return retry != 0;
            });
        }
    }
    class WriteModel extends subscriptionImplementor_2.PublisherImplementor {
        constructor(publisher) {
            super();
            this.writeModelSubscriber = new WriteModelSubscriber(this);
            this.writeModelSubscriber.subscribe(publisher);
            constants_45.logger.debug("Initialized WriteModel");
        }
        commitChanges(event) {
            return __awaiter(this, void 0, void 0, function* () {
                const protectedSpec = event.content.values.protected;
                if (!(protectedSpec === null || protectedSpec === void 0 ? void 0 : protectedSpec.write)) {
                    constants_45.logger.error("Procedure for command database is not specified");
                    return new databaseErrorEvent_11.default("Could not process data", 400);
                }
                return yield protectedSpec.write(event).then(() => (constants_45.logger.debug("Finished processing procedure for command database"), event), (reason) => {
                    constants_45.logger.error("Failed in processing procedure for command database");
                    constants_45.logger.error(`Reason of failure: "${reason}"`);
                    const isStr = reason && typeof (reason) === 'string';
                    const e = new databaseErrorEvent_11.default(isStr ? reason.slice(3) : "Could not retrieve data from the database, please try again later!", isStr ? Math.max(parseInt(reason.slice(0, 3)), 400) : 408);
                    e.content.warning = event.content.warning;
                    return e;
                });
            });
        }
    }
    exports.default = WriteModel;
});
define("src/controller/commandFacade", ["require", "exports", "src/controller/v1/methods/write/sensorWriteMethods", "src/controller/v1/methods/write/actuatorWriteMethods", "src/controller/v1/methods/write/systemLogsWriteMethods", "src/model/patterns/subscriptionImplementor", "src/controller/v1/methods/write/dataSavingWriteMethods", "src/constants", "src/controller/v1/services/firebaseFreetier/sensorService", "src/controller/v1/services/firebaseFreetier/actuatorService", "src/controller/v1/services/firebaseFreetier/systemLogsService", "src/controller/v1/services/firebaseFreetier/dataSavingService", "src/controller/v1/methods/write/systemCommandWriteMethods", "src/controller/v1/services/firebaseFreetier/systemCommandService"], function (require, exports, sensorWriteMethods_2, actuatorWriteMethods_2, systemLogsWriteMethods_2, subscriptionImplementor_3, dataSavingWriteMethods_2, constants_46, sensorService_5, actuatorService_2, systemLogsService_3, dataSavingService_6, systemCommandWriteMethods_2, systemCommandService_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    sensorService_5 = __importDefault(sensorService_5);
    actuatorService_2 = __importDefault(actuatorService_2);
    systemLogsService_3 = __importDefault(systemLogsService_3);
    dataSavingService_6 = __importDefault(dataSavingService_6);
    systemCommandService_3 = __importDefault(systemCommandService_3);
    class CommandFacade extends subscriptionImplementor_3.PublisherImplementor {
        constructor() {
            super();
            sensorWriteMethods_2.SensorWriteMethods.mainService = new sensorService_5.default(this);
            actuatorWriteMethods_2.ActuatorWriteMethods.mainService = new actuatorService_2.default(this);
            systemLogsWriteMethods_2.SystemLogsWriteMethods.mainService = new systemLogsService_3.default(this);
            dataSavingWriteMethods_2.DataSavingWriteMethods.mainService = new dataSavingService_6.default(this);
            systemCommandWriteMethods_2.SystemCommandWriteMethods.mainService = new systemCommandService_3.default(this);
            CommandFacade.sensor = new sensorWriteMethods_2.SensorWriteMethods();
            CommandFacade.actuator = new actuatorWriteMethods_2.ActuatorWriteMethods();
            CommandFacade.logs = new systemLogsWriteMethods_2.SystemLogsWriteMethods();
            CommandFacade.dataSaving = new dataSavingWriteMethods_2.DataSavingWriteMethods();
            CommandFacade.systemCommand = new systemCommandWriteMethods_2.SystemCommandWriteMethods();
            constants_46.logger.debug("CommandFacade is initialized. It is safe to make data transactions now!");
        }
    }
    exports.default = CommandFacade;
});
define("src/controller/v1/model/bus/eventBus", ["require", "exports", "src/constants", "src/model/patterns/subscriptionImplementor", "src/model/v1/events/databaseErrorEvent", "src/utility/filterDatabaseEvent"], function (require, exports, constants_47, subscriptionImplementor_4, databaseErrorEvent_12, filterDatabaseEvent_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseErrorEvent_12 = __importDefault(databaseErrorEvent_12);
    class EventBusSubscriber extends subscriptionImplementor_4.SubscriberImplementor {
        constructor(linkedPublisher) {
            super();
            this.linkedPublisher = linkedPublisher;
        }
        onNextAsync(event) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_47.logger.debug("EventBus.onNextAsync is called");
                return (0, filterDatabaseEvent_6.filterDatabaseEvent)(yield this.linkedPublisher.notifyAsync(event)).unwrapOrElse(() => {
                    constants_47.logger.error("EventBus: DatabaseEvent filtration leads to all error");
                    return new databaseErrorEvent_12.default("The action is failed to be executed", 400);
                });
            });
        }
        onNext(event) {
            constants_47.logger.debug("EventBus.onNext is called");
            super.onNext(event);
            this.linkedPublisher.notify(event);
        }
    }
    class EventBus extends subscriptionImplementor_4.PublisherImplementor {
        constructor(...publishers) {
            super();
            this.eventBusSubscriber = new EventBusSubscriber(this);
            publishers.map(publisher => this.eventBusSubscriber.subscribe(publisher));
            constants_47.logger.debug("Initialized EventBus");
        }
    }
    exports.default = EventBus;
});
define("src/controller/v1/model/eventProcessor", ["require", "exports", "src/constants", "src/model/patterns/subscriptionImplementor", "src/model/v1/events/databaseErrorEvent"], function (require, exports, constants_48, subscriptionImplementor_5, databaseErrorEvent_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseErrorEvent_13 = __importDefault(databaseErrorEvent_13);
    class EventProcessor extends subscriptionImplementor_5.SubscriberImplementor {
        constructor(publisher) {
            super();
            this.subscribe(publisher);
        }
        onNextAsync(event) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_48.logger.debug("EventProcessor.onNextAsync is called");
                const p = event.content.values.protected;
                if (!(p === null || p === void 0 ? void 0 : p.read)) {
                    constants_48.logger.error("Procedure for query database is not specified");
                    return new databaseErrorEvent_13.default("Could not process data", 400);
                }
                return yield event.content.values.protected.read(event).then(() => event, (reason) => {
                    constants_48.logger.error("Failed in processing procedure for updating query database");
                    constants_48.logger.error(`Reason of failure: "${reason}"`);
                    const isStr = reason && typeof (reason) === 'string';
                    const e = new databaseErrorEvent_13.default(isStr ? reason.slice(3) : "Could not retrieve data from query database, please try again later!", isStr ? Math.max(parseInt(reason.slice(0, 3)), 400) : 408);
                    e.content.warning = event.content.warning;
                    return e;
                });
            });
        }
        onNext(event) {
            var _a;
            constants_48.logger.debug("EventProcessor.onNext is called");
            super.onNext(event);
            if ((_a = event.content.values.protected) === null || _a === void 0 ? void 0 : _a.read)
                Promise.all([event.content.values.protected.read(event)]);
        }
    }
    exports.default = EventProcessor;
});
define("src/controller/v1/model/dataSavingModel", ["require", "exports", "src/constants", "src/model/patterns/subscriptionImplementor", "src/model/v1/events/databaseErrorEvent"], function (require, exports, constants_49, subscriptionImplementor_6, databaseErrorEvent_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    databaseErrorEvent_14 = __importDefault(databaseErrorEvent_14);
    class DataSavingModelSubscriber extends subscriptionImplementor_6.SubscriberImplementor {
        constructor(linkedPublisher) {
            super();
            this.linkedPublisher = linkedPublisher;
        }
        onNextAsync(event) {
            return __awaiter(this, void 0, void 0, function* () {
                constants_49.logger.debug("DataSavingModel.onNextAsync is called");
                const newEvent = yield this.linkedPublisher.commitChanges(event);
                if (!(newEvent instanceof databaseErrorEvent_14.default)) {
                    this.linkedPublisher.notify(event);
                }
                return newEvent;
            });
        }
        onNext(event) {
            constants_49.logger.debug("DataSavingModel.onNext is called");
            super.onNext(event);
            Promise.all([this.linkedPublisher.commitChanges(event)]);
            this.linkedPublisher.notify(event);
        }
    }
    class DataSavingModel extends subscriptionImplementor_6.PublisherImplementor {
        constructor(publisher) {
            super();
            this.dataSavingModelSubscriber = new DataSavingModelSubscriber(this);
            this.dataSavingModelSubscriber.subscribe(publisher);
            constants_49.logger.debug("Initialized DataSavingModel");
        }
        commitChanges(event) {
            return __awaiter(this, void 0, void 0, function* () {
                const protectedSpec = event.content.values.protected;
                if (!(protectedSpec === null || protectedSpec === void 0 ? void 0 : protectedSpec.storage)) {
                    constants_49.logger.error("Procedure for storage system is not specified");
                    return new databaseErrorEvent_14.default("Could not process data", 400);
                }
                return yield event.content.values.protected.storage(event).then(() => event, (reason) => {
                    constants_49.logger.error("Failed in processing storage procedure");
                    constants_49.logger.error(`Reason of failure: "${reason}"`);
                    const isStr = reason && typeof (reason) === 'string';
                    const e = new databaseErrorEvent_14.default(isStr ? reason.slice(3) : "Could not retrieve data from the database, please try again later!", isStr ? Math.max(parseInt(reason.slice(0, 3)), 400) : 408);
                    e.content.warning = event.content.warning;
                    return e;
                });
            });
        }
    }
    exports.default = DataSavingModel;
});
define("src/apiSetup", ["require", "exports", "src/constants", "src/controller/v1/model/bus/commandBus", "src/controller/v1/model/writeModel", "src/controller/commandFacade", "src/controller/v1/model/bus/eventBus", "src/controller/v1/model/eventProcessor", "src/controller/v1/model/dataSavingModel"], function (require, exports, constants_50, commandBus_1, writeModel_1, commandFacade_1, eventBus_1, eventProcessor_1, dataSavingModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    commandBus_1 = __importDefault(commandBus_1);
    writeModel_1 = __importDefault(writeModel_1);
    commandFacade_1 = __importDefault(commandFacade_1);
    eventBus_1 = __importDefault(eventBus_1);
    eventProcessor_1 = __importDefault(eventProcessor_1);
    dataSavingModel_1 = __importDefault(dataSavingModel_1);
    function apiSetup(server) {
        const start = new commandFacade_1.default();
        const commandBus = new commandBus_1.default(start);
        const writeModel = new writeModel_1.default(commandBus);
        const dataSavingModel = new dataSavingModel_1.default(commandBus);
        const eventBus = new eventBus_1.default(writeModel);
        const processEvent = new eventProcessor_1.default(eventBus);
        const closePubSub = () => {
            start.end();
            commandBus.end();
            writeModel.end();
            dataSavingModel.end();
            eventBus.end();
            processEvent.onFinished();
        };
        const termination = () => {
            constants_50.logger.info("The process ended with either a SIGINT or SIGTERM");
            closePubSub();
            server === null || server === void 0 ? void 0 : server.close();
            process.exit(0);
        };
        process.on("SIGINT", termination);
        process.on("SIGTERM", termination);
        return closePubSub;
    }
    exports.default = apiSetup;
});
define("src/serverErrorHandler", ["require", "exports", "tsoa", "src/constants"], function (require, exports, tsoa_12, constants_51) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function validationError(err, req) {
        constants_51.logger.error(`
    Caught Validation Error for ${req.path}: ${JSON.stringify(err.fields)}.
    Message named ${err.name}: ${err.message}.
    Stack trace: ${err.stack}.`);
        return {
            message: "Validation Failed",
            details: err === null || err === void 0 ? void 0 : err.fields,
        };
    }
    function genericError(err, req) {
        constants_51.logger.error(`
    Caught Error for ${req.path}: ${err.message}.
    Stack trace: ${err.stack}.
  `);
        if (err.message === "Unsupported state or unable to authenticate data")
            return {
                message: "Wrong credentials. Unable to authenticate data"
            };
        return {
            message: "Internal Server Error"
        };
    }
    function typeError(err, req) {
        constants_51.logger.error(`
    Caught TypeError for ${req.path}: ${err.message}.
    Stack trace: ${err.stack}.`);
        return {
            message: "Internal Server Error"
        };
    }
    function serverErrorHandler(err, req, res, next) {
        if (err instanceof tsoa_12.ValidateError)
            return res.status(422).json(validationError(err, req));
        if (err instanceof TypeError)
            return res.status(500).json(typeError(err, req));
        if (err instanceof Error)
            return res.status(500).json(genericError(err, req));
        next();
    }
    exports.default = serverErrorHandler;
});
define("index", ["require", "exports", "express", "cors", "cookie-parser", "compression", "express-session", "build/routes", "src/view/index", "src/constants", "src/apiSetup", "src/serverErrorHandler", "serve-static"], function (require, exports, express_4, cors_1, cookie_parser_1, compression_2, express_session_1, routes_1, view_1, constants_52, apiSetup_1, serverErrorHandler_1, serve_static_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    express_4 = __importDefault(express_4);
    cors_1 = __importDefault(cors_1);
    cookie_parser_1 = __importDefault(cookie_parser_1);
    compression_2 = __importDefault(compression_2);
    express_session_1 = __importDefault(express_session_1);
    view_1 = __importDefault(view_1);
    apiSetup_1 = __importDefault(apiSetup_1);
    serverErrorHandler_1 = __importDefault(serverErrorHandler_1);
    serve_static_1 = __importDefault(serve_static_1);
    const app = (0, express_4.default)();
    const port = process.env.PORT || 5000;
    app.use(express_4.default.json());
    app.use(express_4.default.urlencoded({
        extended: true
    }));
    app.use((0, cors_1.default)());
    app.use((0, compression_2.default)());
    app.use((0, serve_static_1.default)('public'));
    app.use((0, express_session_1.default)({ secret: constants_52.SESSION_SECRET, resave: true, saveUninitialized: true }));
    app.use((0, cookie_parser_1.default)(constants_52.COOKIE_SECRET));
    app.use('/', view_1.default);
    (0, routes_1.RegisterRoutes)(app);
    app.use(serverErrorHandler_1.default);
    const server = app.listen(port, () => {
        constants_52.logger.info("Start setting up API");
        (0, apiSetup_1.default)(server);
        constants_52.logger.info("Finished setting up API");
        constants_52.logger.info(`Express: Listening on port ${port}`);
    });
    server.on("connect", () => {
        constants_52.logger.info("A user logged in");
    });
    server.on("close", () => {
        constants_52.logger.info("Closing server...");
    });
    module.exports = app;
});
define("src/controller/queryFacade", ["require", "exports", "src/controller/v1/methods/read/actuatorReadMethods", "src/controller/v1/methods/read/systemLogsReadMethods", "src/controller/v1/methods/read/sensorReadMethods", "src/controller/v1/methods/read/dataSavingReadMethods", "src/controller/security/methods/securityMethods", "src/controller/v1/methods/read/systemCommandReadMethods"], function (require, exports, actuatorReadMethods_2, systemLogsReadMethods_2, sensorReadMethods_2, dataSavingReadMethods_2, securityMethods_2, systemCommandReadMethods_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class QueryFacade {
    }
    exports.default = QueryFacade;
    QueryFacade.sensor = new sensorReadMethods_2.SensorReadMethods();
    QueryFacade.actuator = new actuatorReadMethods_2.ActuatorReadMethods();
    QueryFacade.logs = new systemLogsReadMethods_2.SystemLogsReadMethods();
    QueryFacade.dataSaving = new dataSavingReadMethods_2.DataSavingReadMethods();
    QueryFacade.systemCommand = new systemCommandReadMethods_2.SystemCommandReadMethods();
    QueryFacade.security = new securityMethods_2.SecurityMethods();
});
define("src/controller/__tests__/testcases", [], {
    "sensors": [
        {
            "name": "TempActive1Sensor1",
            "type": "Carbon dioxide",
            "isRunning": true
        },
        {
            "name": "TempActive1Sensor2",
            "type": "Temperature",
            "isRunning": true
        },
        {
            "name": "TempActive2Sensor1",
            "type": "Temperature",
            "isRunning": true
        },
        {
            "name": "TempActive2Sensor2",
            "type": "Temperature",
            "isRunning": true
        },
        {
            "name": "TempCuringSensor1",
            "type": "Carbon dioxide",
            "isRunning": true
        },
        {
            "name": "TempCuringSensor2",
            "type": "Moisture",
            "isRunning": true
        },
        {
            "name": "TempCuringSensor3",
            "type": "Temperature",
            "isRunning": true
        },
        {
            "name": "TempCuringSensor4",
            "type": "Temperature",
            "isRunning": true
        },
        {
            "name": "MoistActive1Sensor1",
            "type": "Moisture",
            "isRunning": true
        },
        {
            "name": "MoistActive1Sensor2",
            "type": "Temperature",
            "isRunning": true
        },
        {
            "name": "MoistActive2Sensor1",
            "type": "Moisture",
            "isRunning": true
        },
        {
            "name": "MoistActive2Sensor2",
            "type": "Oxygen",
            "isRunning": true
        },
        {
            "name": "MoistCuringSensor1",
            "type": "Moisture",
            "isRunning": true
        },
        {
            "name": "MoistCuringSensor2",
            "type": "Moisture",
            "isRunning": true
        },
        {
            "name": "O2ExhaustSensor1",
            "type": "Temperature",
            "isRunning": true
        },
        {
            "name": "CH4ExhaustSensor1",
            "type": "Oxygen",
            "isRunning": true
        },
        {
            "name": "CO2ExhaustSensor1",
            "type": "Oxygen",
            "isRunning": true
        }
    ],
    "sensorData": [
        {
            "sensorName": "TempCuringSensor1",
            "value": 6.2,
            "timeStamp": 1659968808
        },
        {
            "sensorName": "TempCuringSensor2",
            "value": 16.4,
            "timeStamp": 1660403735
        },
        {
            "sensorName": "CH4ExhaustSensor1",
            "value": 32.7,
            "timeStamp": 1660552652
        },
        {
            "sensorName": "TempCuringSensor4",
            "value": 11.9,
            "timeStamp": 1660754314
        },
        {
            "sensorName": "MoistCuringSensor1",
            "value": 65.0,
            "timeStamp": 1660534635
        },
        {
            "sensorName": "TempActive2Sensor2",
            "value": 2.7,
            "timeStamp": 1659976581
        },
        {
            "sensorName": "TempCuringSensor4",
            "value": 74.7,
            "timeStamp": 1660734897
        },
        {
            "sensorName": "MoistActive2Sensor1",
            "value": 51.4,
            "timeStamp": 1660348021
        },
        {
            "sensorName": "CO2ExhaustSensor1",
            "value": 19.3,
            "timeStamp": 1660439892
        },
        {
            "sensorName": "MoistActive1Sensor1",
            "value": 13.5,
            "timeStamp": 1660916940
        },
        {
            "sensorName": "O2ExhaustSensor1",
            "value": 61.6,
            "timeStamp": 1660756260
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 9.4,
            "timeStamp": 1660130538
        },
        {
            "sensorName": "MoistActive1Sensor1",
            "value": 31.9,
            "timeStamp": 1660148955
        },
        {
            "sensorName": "TempActive1Sensor1",
            "value": 92.3,
            "timeStamp": 1660715842
        },
        {
            "sensorName": "TempActive2Sensor2",
            "value": 43.3,
            "timeStamp": 1660230839
        },
        {
            "sensorName": "TempActive1Sensor2",
            "value": 84.0,
            "timeStamp": 1660462393
        },
        {
            "sensorName": "CH4ExhaustSensor1",
            "value": 49.9,
            "timeStamp": 1661072509
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 64.2,
            "timeStamp": 1660567360
        },
        {
            "sensorName": "TempCuringSensor1",
            "value": 86.5,
            "timeStamp": 1660743429
        },
        {
            "sensorName": "MoistCuringSensor1",
            "value": 61.5,
            "timeStamp": 1660044027
        },
        {
            "sensorName": "TempCuringSensor3",
            "value": 31.7,
            "timeStamp": 1660481634
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 32.3,
            "timeStamp": 1660934397
        },
        {
            "sensorName": "TempCuringSensor2",
            "value": 86.0,
            "timeStamp": 1660973218
        },
        {
            "sensorName": "MoistCuringSensor2",
            "value": 94.4,
            "timeStamp": 1660188732
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 28.8,
            "timeStamp": 1660180017
        },
        {
            "sensorName": "TempActive1Sensor2",
            "value": 91.9,
            "timeStamp": 1660632711
        },
        {
            "sensorName": "TempCuringSensor2",
            "value": 33.6,
            "timeStamp": 1659974525
        },
        {
            "sensorName": "MoistActive1Sensor2",
            "value": 39.1,
            "timeStamp": 1659916801
        },
        {
            "sensorName": "MoistCuringSensor1",
            "value": 79.8,
            "timeStamp": 1660842764
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 44.2,
            "timeStamp": 1661019936
        },
        {
            "sensorName": "TempCuringSensor4",
            "value": 66.2,
            "timeStamp": 1660298663
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 83.7,
            "timeStamp": 1660815513
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 48.4,
            "timeStamp": 1659923022
        },
        {
            "sensorName": "MoistCuringSensor2",
            "value": 70.8,
            "timeStamp": 1660152266
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 62.8,
            "timeStamp": 1660874330
        },
        {
            "sensorName": "MoistCuringSensor1",
            "value": 67.4,
            "timeStamp": 1661050158
        },
        {
            "sensorName": "MoistActive1Sensor2",
            "value": 10.4,
            "timeStamp": 1660801398
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 49.5,
            "timeStamp": 1661056130
        },
        {
            "sensorName": "MoistActive2Sensor1",
            "value": 20.5,
            "timeStamp": 1660738466
        },
        {
            "sensorName": "CO2ExhaustSensor1",
            "value": 21.6,
            "timeStamp": 1660455858
        },
        {
            "sensorName": "MoistCuringSensor2",
            "value": 85.9,
            "timeStamp": 1660133444
        },
        {
            "sensorName": "MoistCuringSensor1",
            "value": 18.5,
            "timeStamp": 1660565501
        },
        {
            "sensorName": "MoistCuringSensor2",
            "value": 42.2,
            "timeStamp": 1660507738
        },
        {
            "sensorName": "O2ExhaustSensor1",
            "value": 27.4,
            "timeStamp": 1660736369
        },
        {
            "sensorName": "TempActive2Sensor2",
            "value": 54.5,
            "timeStamp": 1660793284
        },
        {
            "sensorName": "TempActive1Sensor1",
            "value": 47.4,
            "timeStamp": 1660435766
        },
        {
            "sensorName": "CH4ExhaustSensor1",
            "value": 80.2,
            "timeStamp": 1661022995
        },
        {
            "sensorName": "TempActive2Sensor1",
            "value": 16.3,
            "timeStamp": 1660170762
        },
        {
            "sensorName": "TempCuringSensor2",
            "value": 43.8,
            "timeStamp": 1660191541
        },
        {
            "sensorName": "O2ExhaustSensor1",
            "value": 28.6,
            "timeStamp": 1660364897
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 41.7,
            "timeStamp": 1659923439
        },
        {
            "sensorName": "CH4ExhaustSensor1",
            "value": 55.3,
            "timeStamp": 1660191662
        },
        {
            "sensorName": "TempActive1Sensor1",
            "value": 26.1,
            "timeStamp": 1660098610
        },
        {
            "sensorName": "MoistCuringSensor1",
            "value": 65.4,
            "timeStamp": 1660096137
        },
        {
            "sensorName": "TempCuringSensor4",
            "value": 42.6,
            "timeStamp": 1661094416
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 65.5,
            "timeStamp": 1660750786
        },
        {
            "sensorName": "TempCuringSensor2",
            "value": 46.8,
            "timeStamp": 1660461676
        },
        {
            "sensorName": "O2ExhaustSensor1",
            "value": 2.5,
            "timeStamp": 1661012361
        },
        {
            "sensorName": "TempCuringSensor1",
            "value": 58.3,
            "timeStamp": 1660302472
        },
        {
            "sensorName": "TempCuringSensor3",
            "value": 55.8,
            "timeStamp": 1660682087
        },
        {
            "sensorName": "TempCuringSensor1",
            "value": 1.6,
            "timeStamp": 1660771850
        },
        {
            "sensorName": "TempActive1Sensor1",
            "value": 76.0,
            "timeStamp": 1660497464
        },
        {
            "sensorName": "TempCuringSensor2",
            "value": 78.7,
            "timeStamp": 1660636684
        },
        {
            "sensorName": "CO2ExhaustSensor1",
            "value": 59.5,
            "timeStamp": 1660577520
        },
        {
            "sensorName": "TempActive2Sensor1",
            "value": 29.4,
            "timeStamp": 1661029053
        },
        {
            "sensorName": "MoistActive2Sensor1",
            "value": 70.3,
            "timeStamp": 1660415899
        },
        {
            "sensorName": "CH4ExhaustSensor1",
            "value": 91.5,
            "timeStamp": 1660573871
        },
        {
            "sensorName": "TempActive1Sensor1",
            "value": 4.8,
            "timeStamp": 1660502061
        },
        {
            "sensorName": "TempCuringSensor3",
            "value": 52.1,
            "timeStamp": 1660343240
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 12.8,
            "timeStamp": 1660255715
        },
        {
            "sensorName": "TempCuringSensor3",
            "value": 47.1,
            "timeStamp": 1661042655
        },
        {
            "sensorName": "MoistCuringSensor2",
            "value": 40.4,
            "timeStamp": 1660146565
        },
        {
            "sensorName": "MoistActive1Sensor1",
            "value": 6.7,
            "timeStamp": 1660029651
        },
        {
            "sensorName": "TempActive2Sensor1",
            "value": 47.7,
            "timeStamp": 1660191560
        },
        {
            "sensorName": "TempActive2Sensor2",
            "value": 95.7,
            "timeStamp": 1660957885
        },
        {
            "sensorName": "CO2ExhaustSensor1",
            "value": 63.0,
            "timeStamp": 1660017378
        },
        {
            "sensorName": "MoistActive2Sensor1",
            "value": 77.2,
            "timeStamp": 1659968583
        },
        {
            "sensorName": "TempCuringSensor1",
            "value": 15.4,
            "timeStamp": 1660162400
        },
        {
            "sensorName": "TempCuringSensor4",
            "value": 23.8,
            "timeStamp": 1659966733
        },
        {
            "sensorName": "TempCuringSensor2",
            "value": 18.0,
            "timeStamp": 1660328589
        },
        {
            "sensorName": "TempCuringSensor1",
            "value": 77.3,
            "timeStamp": 1660630165
        },
        {
            "sensorName": "TempCuringSensor4",
            "value": 90.3,
            "timeStamp": 1660308297
        },
        {
            "sensorName": "O2ExhaustSensor1",
            "value": 45.4,
            "timeStamp": 1660217189
        },
        {
            "sensorName": "TempActive1Sensor2",
            "value": 5.2,
            "timeStamp": 1660289468
        },
        {
            "sensorName": "MoistCuringSensor1",
            "value": 77.8,
            "timeStamp": 1660680093
        },
        {
            "sensorName": "TempCuringSensor3",
            "value": 42.4,
            "timeStamp": 1660074658
        },
        {
            "sensorName": "TempCuringSensor3",
            "value": 23.0,
            "timeStamp": 1660196094
        },
        {
            "sensorName": "TempActive2Sensor2",
            "value": 69.9,
            "timeStamp": 1659920745
        },
        {
            "sensorName": "TempCuringSensor1",
            "value": 11.6,
            "timeStamp": 1661007790
        },
        {
            "sensorName": "MoistCuringSensor1",
            "value": 55.3,
            "timeStamp": 1660292129
        },
        {
            "sensorName": "CO2ExhaustSensor1",
            "value": 94.3,
            "timeStamp": 1660932755
        },
        {
            "sensorName": "TempCuringSensor3",
            "value": 81.8,
            "timeStamp": 1660260055
        },
        {
            "sensorName": "TempActive2Sensor1",
            "value": 8.4,
            "timeStamp": 1660091546
        },
        {
            "sensorName": "MoistCuringSensor1",
            "value": 38.7,
            "timeStamp": 1660978116
        },
        {
            "sensorName": "MoistCuringSensor2",
            "value": 59.2,
            "timeStamp": 1660475546
        },
        {
            "sensorName": "MoistActive2Sensor1",
            "value": 35.9,
            "timeStamp": 1659990462
        },
        {
            "sensorName": "MoistActive2Sensor2",
            "value": 18.2,
            "timeStamp": 1660154756
        },
        {
            "sensorName": "TempActive1Sensor2",
            "value": 0.4,
            "timeStamp": 1660043551
        },
        {
            "sensorName": "TempActive2Sensor1",
            "value": 56.5,
            "timeStamp": 1660899652
        },
        {
            "sensorName": "TempCuringSensor1",
            "value": 89.0,
            "timeStamp": 1660216869
        }
    ],
    "actuators": [
        {
            "name": "Motor1",
            "type": "Air pump",
            "isRunning": false
        },
        {
            "name": "Motor2",
            "type": "Air pump",
            "isRunning": true
        },
        {
            "name": "Air pump1",
            "type": "Air pump",
            "isRunning": false
        },
        {
            "name": "Air pump2",
            "type": "Motor",
            "isRunning": true
        },
        {
            "name": "Air pump3",
            "type": "Motor",
            "isRunning": true
        },
        {
            "name": "Air pump4",
            "type": "Motor",
            "isRunning": true
        }
    ],
    "actuatorConfigs": [
        {
            "actuatorName": "Motor1",
            "timeStamp": 1660911142,
            "timesPerDay": 2,
            "motorConfig": [
                {
                    "duration": 5,
                    "isClockwise": false
                },
                {
                    "duration": 2,
                    "isClockwise": true
                },
                {
                    "duration": 6,
                    "isClockwise": false
                }
            ]
        },
        {
            "actuatorName": "Motor2",
            "timeStamp": 1659952757,
            "timesPerDay": 1,
            "motorConfig": [
                {
                    "duration": 6,
                    "isClockwise": true
                },
                {
                    "duration": 3,
                    "isClockwise": true
                }
            ]
        },
        {
            "actuatorName": "Air pump1",
            "timeStamp": 1660704097,
            "timesPerDay": 3,
            "motorConfig": [
                {
                    "duration": 7,
                    "isClockwise": false
                },
                {
                    "duration": 4,
                    "isClockwise": false
                }
            ]
        },
        {
            "actuatorName": "Air pump2",
            "timeStamp": 1660294092,
            "timesPerDay": 2,
            "motorConfig": [
                {
                    "duration": 7,
                    "isClockwise": false
                },
                {
                    "duration": 3,
                    "isClockwise": true
                },
                {
                    "duration": 2,
                    "isClockwise": false
                }
            ]
        },
        {
            "actuatorName": "Air pump3",
            "timeStamp": 1660869862,
            "toggleConfig": {
                "state": true
            }
        },
        {
            "actuatorName": "Air pump4",
            "timeStamp": 1659962272,
            "timesPerDay": 2,
            "motorConfig": [
                {
                    "duration": 7,
                    "isClockwise": true
                },
                {
                    "duration": 6,
                    "isClockwise": true
                }
            ]
        }
    ],
    "sensorLogs": [
        "Sensor \"TempActive2Sensor1\" is working properly",
        "Sensor \"TempCuringSensor4\" is working properly",
        "Sensor \"MoistCuringSensor2\" is working properly",
        "Sensor \"TempActive2Sensor1\" is working properly",
        "Sensor \"TempCuringSensor1\" is working properly",
        "Sensor \"TempActive2Sensor1\" is working properly",
        "Sensor \"MoistActive2Sensor1\" is working properly",
        "Sensor \"TempActive2Sensor2\" is working properly",
        "Sensor \"CO2ExhaustSensor1\" is working properly",
        "Sensor \"MoistActive1Sensor1\" is working properly",
        "Sensor \"CH4ExhaustSensor1\" is working properly",
        "Sensor \"TempActive1Sensor1\" is working properly",
        "Sensor \"TempActive1Sensor1\" is working properly",
        "Sensor \"TempCuringSensor4\" is working properly",
        "Sensor \"TempActive1Sensor1\" is working properly",
        "Sensor \"CH4ExhaustSensor1\" is working properly",
        "Sensor \"MoistCuringSensor1\" is working properly",
        "Sensor \"CH4ExhaustSensor1\" is working properly",
        "Sensor \"MoistCuringSensor1\" is working properly",
        "Sensor \"TempActive1Sensor1\" is working properly",
        "Sensor \"TempActive2Sensor2\" is working properly",
        "Sensor \"TempActive1Sensor2\" is working properly",
        "Sensor \"TempCuringSensor3\" is working properly",
        "Sensor \"TempCuringSensor1\" is working properly",
        "Sensor \"MoistActive1Sensor1\" is working properly",
        "Sensor \"O2ExhaustSensor1\" is working properly",
        "Sensor \"O2ExhaustSensor1\" is working properly",
        "Sensor \"MoistCuringSensor1\" is working properly",
        "Sensor \"TempActive2Sensor1\" is working properly",
        "Sensor \"MoistActive2Sensor2\" is working properly",
        "Sensor \"MoistCuringSensor1\" is working properly",
        "Sensor \"TempCuringSensor1\" is working properly",
        "Sensor \"MoistActive2Sensor2\" is working properly",
        "Sensor \"TempActive2Sensor1\" is working properly",
        "Sensor \"MoistCuringSensor1\" is working properly",
        "Sensor \"TempCuringSensor4\" is working properly",
        "Sensor \"MoistCuringSensor2\" is working properly",
        "Sensor \"TempCuringSensor2\" is working properly",
        "Sensor \"TempCuringSensor3\" is working properly",
        "Sensor \"MoistCuringSensor1\" is working properly",
        "Sensor \"MoistActive2Sensor1\" is working properly",
        "Sensor \"TempCuringSensor3\" is working properly",
        "Sensor \"TempCuringSensor3\" is working properly",
        "Sensor \"MoistCuringSensor2\" is working properly",
        "Sensor \"TempCuringSensor1\" is working properly",
        "Sensor \"O2ExhaustSensor1\" is working properly",
        "Sensor \"TempActive1Sensor1\" is working properly",
        "Sensor \"CH4ExhaustSensor1\" is working properly",
        "Sensor \"TempActive1Sensor1\" is working properly",
        "Sensor \"MoistActive2Sensor2\" is working properly",
        "Sensor \"TempActive1Sensor2\" is working properly",
        "Sensor \"TempCuringSensor2\" is working properly",
        "Sensor \"TempCuringSensor4\" is working properly",
        "Sensor \"MoistActive2Sensor1\" is working properly",
        "Sensor \"TempActive1Sensor1\" is working properly",
        "Sensor \"TempActive2Sensor2\" is working properly",
        "Sensor \"MoistActive1Sensor2\" is working properly",
        "Sensor \"CH4ExhaustSensor1\" is working properly",
        "Sensor \"MoistActive2Sensor2\" is working properly",
        "Sensor \"TempCuringSensor1\" is working properly",
        "Sensor \"O2ExhaustSensor1\" is working properly",
        "Sensor \"CO2ExhaustSensor1\" is working properly",
        "Sensor \"O2ExhaustSensor1\" is working properly",
        "Sensor \"TempCuringSensor1\" is working properly",
        "Sensor \"CH4ExhaustSensor1\" is working properly",
        "Sensor \"O2ExhaustSensor1\" is working properly",
        "Sensor \"MoistActive2Sensor2\" is working properly",
        "Sensor \"MoistCuringSensor2\" is working properly",
        "Sensor \"TempCuringSensor1\" is working properly",
        "Sensor \"MoistActive2Sensor1\" is working properly",
        "Sensor \"TempActive2Sensor2\" is working properly",
        "Sensor \"MoistActive2Sensor1\" is working properly",
        "Sensor \"MoistActive1Sensor1\" is working properly",
        "Sensor \"CO2ExhaustSensor1\" is working properly",
        "Sensor \"CO2ExhaustSensor1\" is working properly",
        "Sensor \"MoistActive2Sensor2\" is working properly",
        "Sensor \"CH4ExhaustSensor1\" is working properly",
        "Sensor \"CO2ExhaustSensor1\" is working properly",
        "Sensor \"O2ExhaustSensor1\" is working properly",
        "Sensor \"TempCuringSensor2\" is working properly",
        "Sensor \"TempCuringSensor4\" is working properly",
        "Sensor \"TempActive1Sensor1\" is working properly",
        "Sensor \"TempCuringSensor3\" is working properly",
        "Sensor \"O2ExhaustSensor1\" is working properly",
        "Sensor \"CO2ExhaustSensor1\" is working properly",
        "Sensor \"MoistCuringSensor1\" is working properly",
        "Sensor \"CH4ExhaustSensor1\" is working properly",
        "Sensor \"TempCuringSensor4\" is working properly",
        "Sensor \"MoistCuringSensor2\" is working properly",
        "Sensor \"TempCuringSensor1\" is working properly",
        "Sensor \"TempActive1Sensor2\" is working properly",
        "Sensor \"CO2ExhaustSensor1\" is working properly",
        "Sensor \"TempActive2Sensor1\" is working properly",
        "Sensor \"TempCuringSensor4\" is working properly",
        "Sensor \"TempCuringSensor3\" is working properly",
        "Sensor \"CO2ExhaustSensor1\" is working properly",
        "Sensor \"TempActive2Sensor1\" is working properly",
        "Sensor \"TempActive2Sensor2\" is working properly",
        "Sensor \"TempCuringSensor1\" is working properly",
        "Sensor \"TempCuringSensor2\" is working properly"
    ],
    "actuatorLogs": [
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Air pump2\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump3\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Motor2\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump4\" is working properly",
        "Actuator \"Air pump1\" is working properly",
        "Actuator \"Motor1\" is working properly",
        "Actuator \"Air pump2\" is working properly"
    ],
    "dataSaving": {
        "sensor": [
            {
                "sensor": [
                    {
                        "name": "TempActive1Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive1Sensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor3",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor4",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "O2ExhaustSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "CH4ExhaustSensor1",
                        "type": "Temperature",
                        "isRunning": true
                    }
                ],
                "sensorData": [
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 75.4,
                        "timeStamp": 1609525145
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 73.7,
                        "timeStamp": 1609465769
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 93.5,
                        "timeStamp": 1609529054
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 1.6,
                        "timeStamp": 1609474797
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 47.8,
                        "timeStamp": 1609463637
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 37.5,
                        "timeStamp": 1609510640
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 45.9,
                        "timeStamp": 1609476474
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 45.8,
                        "timeStamp": 1609474174
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 95.2,
                        "timeStamp": 1609508033
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 66.0,
                        "timeStamp": 1609473184
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 85.2,
                        "timeStamp": 1609479550
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 21.8,
                        "timeStamp": 1609493649
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 8.6,
                        "timeStamp": 1609476205
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 95.6,
                        "timeStamp": 1609544309
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 13.1,
                        "timeStamp": 1609469241
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 89.2,
                        "timeStamp": 1609462056
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 55.2,
                        "timeStamp": 1609521448
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 9.1,
                        "timeStamp": 1609541761
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 83.9,
                        "timeStamp": 1609527103
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 26.0,
                        "timeStamp": 1609460952
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 3.2,
                        "timeStamp": 1609532974
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 10.6,
                        "timeStamp": 1609481176
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 27.6,
                        "timeStamp": 1609527639
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 27.4,
                        "timeStamp": 1609480732
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 71.5,
                        "timeStamp": 1609468537
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 63.3,
                        "timeStamp": 1609473652
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 52.7,
                        "timeStamp": 1609483590
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 26.0,
                        "timeStamp": 1609543039
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 86.6,
                        "timeStamp": 1609541295
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 28.0,
                        "timeStamp": 1609510006
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 57.9,
                        "timeStamp": 1609516746
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 71.5,
                        "timeStamp": 1609524590
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 70.5,
                        "timeStamp": 1609473194
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 60.3,
                        "timeStamp": 1609473882
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 5.5,
                        "timeStamp": 1609502187
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 30.7,
                        "timeStamp": 1609540839
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 61.3,
                        "timeStamp": 1609537121
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 90.6,
                        "timeStamp": 1609480457
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 5.4,
                        "timeStamp": 1609478755
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 63.5,
                        "timeStamp": 1609461578
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 11.0,
                        "timeStamp": 1609480681
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 12.0,
                        "timeStamp": 1609544132
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 85.9,
                        "timeStamp": 1609468169
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 3.8,
                        "timeStamp": 1609526317
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 95.4,
                        "timeStamp": 1609544591
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 93.6,
                        "timeStamp": 1609537122
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 60.5,
                        "timeStamp": 1609495237
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 23.8,
                        "timeStamp": 1609544401
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 98.2,
                        "timeStamp": 1609526189
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 14.4,
                        "timeStamp": 1609522502
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 14.5,
                        "timeStamp": 1609537765
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 68.5,
                        "timeStamp": 1609536812
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 1.4,
                        "timeStamp": 1609531191
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 19.4,
                        "timeStamp": 1609539648
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 82.4,
                        "timeStamp": 1609477023
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 31.6,
                        "timeStamp": 1609461272
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 91.5,
                        "timeStamp": 1609520318
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 48.3,
                        "timeStamp": 1609503052
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 18.4,
                        "timeStamp": 1609503364
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 88.2,
                        "timeStamp": 1609520286
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 69.6,
                        "timeStamp": 1609534123
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 75.6,
                        "timeStamp": 1609479317
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 22.5,
                        "timeStamp": 1609472711
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 17.8,
                        "timeStamp": 1609498469
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 88.2,
                        "timeStamp": 1609462726
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 64.1,
                        "timeStamp": 1609535399
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 87.8,
                        "timeStamp": 1609475371
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 44.4,
                        "timeStamp": 1609532857
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 67.7,
                        "timeStamp": 1609484912
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 98.5,
                        "timeStamp": 1609540177
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 75.5,
                        "timeStamp": 1609466798
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 6.2,
                        "timeStamp": 1609543862
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 84.8,
                        "timeStamp": 1609537933
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 43.8,
                        "timeStamp": 1609479209
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 55.4,
                        "timeStamp": 1609487773
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 15.1,
                        "timeStamp": 1609463628
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 7.6,
                        "timeStamp": 1609541549
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 100.0,
                        "timeStamp": 1609497215
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 64.2,
                        "timeStamp": 1609531202
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 50.9,
                        "timeStamp": 1609494082
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 93.4,
                        "timeStamp": 1609506131
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 9.7,
                        "timeStamp": 1609465819
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 71.0,
                        "timeStamp": 1609480815
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 29.3,
                        "timeStamp": 1609509734
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 94.0,
                        "timeStamp": 1609544055
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 39.6,
                        "timeStamp": 1609529559
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 19.9,
                        "timeStamp": 1609493799
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 55.0,
                        "timeStamp": 1609527612
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 99.4,
                        "timeStamp": 1609522850
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 33.8,
                        "timeStamp": 1609527799
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 64.5,
                        "timeStamp": 1609491475
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 52.3,
                        "timeStamp": 1609531028
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 14.1,
                        "timeStamp": 1609472716
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 34.9,
                        "timeStamp": 1609463122
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 13.2,
                        "timeStamp": 1609518706
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 23.5,
                        "timeStamp": 1609528962
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 59.4,
                        "timeStamp": 1609540783
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 13.5,
                        "timeStamp": 1609502302
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 56.6,
                        "timeStamp": 1609542963
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 2.9,
                        "timeStamp": 1609543573
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "name": "TempActive1Sensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive1Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor3",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor4",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "O2ExhaustSensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "CH4ExhaustSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    }
                ],
                "sensorData": [
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 79.4,
                        "timeStamp": 1609573349
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 74.0,
                        "timeStamp": 1609606053
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 17.0,
                        "timeStamp": 1609617611
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 60.9,
                        "timeStamp": 1609601337
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 96.5,
                        "timeStamp": 1609595428
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 94.5,
                        "timeStamp": 1609586111
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 77.1,
                        "timeStamp": 1609620427
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 81.2,
                        "timeStamp": 1609565295
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 45.7,
                        "timeStamp": 1609595132
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 68.3,
                        "timeStamp": 1609546989
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 76.9,
                        "timeStamp": 1609575883
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 69.7,
                        "timeStamp": 1609612071
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 26.4,
                        "timeStamp": 1609554474
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 53.8,
                        "timeStamp": 1609580964
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 6.0,
                        "timeStamp": 1609625547
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 19.4,
                        "timeStamp": 1609566510
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 43.0,
                        "timeStamp": 1609610677
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 45.3,
                        "timeStamp": 1609627079
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 37.5,
                        "timeStamp": 1609630553
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 2.4,
                        "timeStamp": 1609577212
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 96.6,
                        "timeStamp": 1609610210
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 15.2,
                        "timeStamp": 1609584668
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 16.9,
                        "timeStamp": 1609592474
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 14.4,
                        "timeStamp": 1609616786
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 33.2,
                        "timeStamp": 1609559757
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 10.3,
                        "timeStamp": 1609631544
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 40.4,
                        "timeStamp": 1609557823
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 99.9,
                        "timeStamp": 1609588933
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 33.0,
                        "timeStamp": 1609570991
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 55.6,
                        "timeStamp": 1609600928
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 40.4,
                        "timeStamp": 1609620444
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 36.9,
                        "timeStamp": 1609626607
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 18.1,
                        "timeStamp": 1609600282
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 20.9,
                        "timeStamp": 1609564702
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 61.8,
                        "timeStamp": 1609562954
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 74.2,
                        "timeStamp": 1609616171
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 92.1,
                        "timeStamp": 1609628552
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 92.4,
                        "timeStamp": 1609556426
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 61.7,
                        "timeStamp": 1609617575
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 80.6,
                        "timeStamp": 1609583658
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 13.6,
                        "timeStamp": 1609549349
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 42.7,
                        "timeStamp": 1609555327
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 97.0,
                        "timeStamp": 1609573586
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 45.0,
                        "timeStamp": 1609597930
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 43.3,
                        "timeStamp": 1609608194
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 58.2,
                        "timeStamp": 1609623231
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 28.7,
                        "timeStamp": 1609588344
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 9.2,
                        "timeStamp": 1609593091
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 18.7,
                        "timeStamp": 1609623650
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 15.7,
                        "timeStamp": 1609615339
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 50.4,
                        "timeStamp": 1609575021
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 16.0,
                        "timeStamp": 1609625526
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 37.8,
                        "timeStamp": 1609623214
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 53.8,
                        "timeStamp": 1609555863
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 6.2,
                        "timeStamp": 1609628760
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 7.5,
                        "timeStamp": 1609618224
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 42.9,
                        "timeStamp": 1609563987
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 22.1,
                        "timeStamp": 1609607378
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 86.8,
                        "timeStamp": 1609558443
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 4.3,
                        "timeStamp": 1609557834
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 38.8,
                        "timeStamp": 1609560645
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 34.6,
                        "timeStamp": 1609567028
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 86.1,
                        "timeStamp": 1609610071
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 28.7,
                        "timeStamp": 1609615141
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 96.4,
                        "timeStamp": 1609587477
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 13.4,
                        "timeStamp": 1609627004
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 8.3,
                        "timeStamp": 1609553542
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 41.3,
                        "timeStamp": 1609549310
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 85.0,
                        "timeStamp": 1609626155
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 67.7,
                        "timeStamp": 1609592616
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 99.9,
                        "timeStamp": 1609571677
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 8.4,
                        "timeStamp": 1609614722
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 67.2,
                        "timeStamp": 1609615581
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 15.9,
                        "timeStamp": 1609629808
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 34.5,
                        "timeStamp": 1609554321
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 3.2,
                        "timeStamp": 1609565861
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 55.5,
                        "timeStamp": 1609572060
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 30.9,
                        "timeStamp": 1609627508
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 62.9,
                        "timeStamp": 1609549869
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 24.5,
                        "timeStamp": 1609560654
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 17.9,
                        "timeStamp": 1609626270
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 77.7,
                        "timeStamp": 1609591831
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 66.0,
                        "timeStamp": 1609571272
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 2.0,
                        "timeStamp": 1609628776
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 96.2,
                        "timeStamp": 1609600619
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 15.9,
                        "timeStamp": 1609615395
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 59.7,
                        "timeStamp": 1609573167
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 43.9,
                        "timeStamp": 1609577079
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 81.1,
                        "timeStamp": 1609577312
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 36.1,
                        "timeStamp": 1609566207
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 47.6,
                        "timeStamp": 1609627654
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 44.1,
                        "timeStamp": 1609583020
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 40.2,
                        "timeStamp": 1609627009
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 40.9,
                        "timeStamp": 1609565512
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 5.0,
                        "timeStamp": 1609559271
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 52.0,
                        "timeStamp": 1609606007
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 30.5,
                        "timeStamp": 1609581141
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 77.8,
                        "timeStamp": 1609628725
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 28.2,
                        "timeStamp": 1609601502
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 72.6,
                        "timeStamp": 1609625240
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "name": "TempActive1Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive1Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor3",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor4",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "O2ExhaustSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "CH4ExhaustSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    }
                ],
                "sensorData": [
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 88.9,
                        "timeStamp": 1609661126
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 31.2,
                        "timeStamp": 1609706215
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 41.3,
                        "timeStamp": 1609709432
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 94.9,
                        "timeStamp": 1609705696
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 6.6,
                        "timeStamp": 1609710279
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 9.1,
                        "timeStamp": 1609655676
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 70.3,
                        "timeStamp": 1609705571
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 38.8,
                        "timeStamp": 1609704633
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 33.9,
                        "timeStamp": 1609650749
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 17.9,
                        "timeStamp": 1609674110
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 60.3,
                        "timeStamp": 1609703794
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 44.3,
                        "timeStamp": 1609664390
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 20.7,
                        "timeStamp": 1609660278
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 86.8,
                        "timeStamp": 1609712239
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 94.0,
                        "timeStamp": 1609690845
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 4.2,
                        "timeStamp": 1609651549
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 46.9,
                        "timeStamp": 1609656117
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 85.7,
                        "timeStamp": 1609667649
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 0.2,
                        "timeStamp": 1609645445
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 45.4,
                        "timeStamp": 1609670113
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 69.9,
                        "timeStamp": 1609666453
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 20.9,
                        "timeStamp": 1609675296
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 58.9,
                        "timeStamp": 1609667238
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 80.6,
                        "timeStamp": 1609706731
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 51.1,
                        "timeStamp": 1609704576
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 91.1,
                        "timeStamp": 1609665387
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 3.2,
                        "timeStamp": 1609694934
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 65.0,
                        "timeStamp": 1609699666
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 18.5,
                        "timeStamp": 1609716323
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 22.0,
                        "timeStamp": 1609637784
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 46.8,
                        "timeStamp": 1609693739
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 34.4,
                        "timeStamp": 1609635706
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 26.0,
                        "timeStamp": 1609638038
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 32.5,
                        "timeStamp": 1609693953
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 72.1,
                        "timeStamp": 1609706803
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 58.1,
                        "timeStamp": 1609661999
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 73.5,
                        "timeStamp": 1609683510
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 30.1,
                        "timeStamp": 1609671404
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 13.3,
                        "timeStamp": 1609646281
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 76.3,
                        "timeStamp": 1609646608
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 92.5,
                        "timeStamp": 1609692294
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 52.5,
                        "timeStamp": 1609638273
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 35.6,
                        "timeStamp": 1609714897
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 37.3,
                        "timeStamp": 1609658586
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 59.2,
                        "timeStamp": 1609660077
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 13.7,
                        "timeStamp": 1609714775
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 87.8,
                        "timeStamp": 1609685228
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 53.6,
                        "timeStamp": 1609685167
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 99.4,
                        "timeStamp": 1609639561
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 20.9,
                        "timeStamp": 1609691755
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 94.2,
                        "timeStamp": 1609662813
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 1.8,
                        "timeStamp": 1609697193
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 1.1,
                        "timeStamp": 1609637438
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 12.9,
                        "timeStamp": 1609708760
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 7.4,
                        "timeStamp": 1609682401
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 49.9,
                        "timeStamp": 1609670695
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 38.0,
                        "timeStamp": 1609649915
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 5.1,
                        "timeStamp": 1609700352
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 2.8,
                        "timeStamp": 1609702520
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 43.0,
                        "timeStamp": 1609662768
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 70.7,
                        "timeStamp": 1609679821
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 25.3,
                        "timeStamp": 1609709777
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 99.9,
                        "timeStamp": 1609637169
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 61.1,
                        "timeStamp": 1609717848
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 33.3,
                        "timeStamp": 1609634144
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 6.6,
                        "timeStamp": 1609693499
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 66.0,
                        "timeStamp": 1609698162
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 6.5,
                        "timeStamp": 1609675999
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 39.3,
                        "timeStamp": 1609680929
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 0.4,
                        "timeStamp": 1609658371
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 11.7,
                        "timeStamp": 1609674948
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 18.6,
                        "timeStamp": 1609645363
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 38.6,
                        "timeStamp": 1609680130
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 83.2,
                        "timeStamp": 1609646775
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 81.2,
                        "timeStamp": 1609677367
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 70.3,
                        "timeStamp": 1609697690
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 69.5,
                        "timeStamp": 1609672904
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 64.1,
                        "timeStamp": 1609657713
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 68.1,
                        "timeStamp": 1609681783
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 40.9,
                        "timeStamp": 1609694612
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 26.5,
                        "timeStamp": 1609664345
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 51.4,
                        "timeStamp": 1609704868
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 59.7,
                        "timeStamp": 1609669550
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 5.1,
                        "timeStamp": 1609687004
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 84.4,
                        "timeStamp": 1609699317
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 29.4,
                        "timeStamp": 1609638503
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 15.9,
                        "timeStamp": 1609673097
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 63.8,
                        "timeStamp": 1609671661
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 73.9,
                        "timeStamp": 1609644205
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 19.9,
                        "timeStamp": 1609670906
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 58.6,
                        "timeStamp": 1609650886
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 99.4,
                        "timeStamp": 1609648487
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 30.0,
                        "timeStamp": 1609632130
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 58.6,
                        "timeStamp": 1609692654
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 72.2,
                        "timeStamp": 1609708399
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 85.1,
                        "timeStamp": 1609704148
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 69.2,
                        "timeStamp": 1609665898
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 5.6,
                        "timeStamp": 1609655477
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 51.5,
                        "timeStamp": 1609645400
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 22.1,
                        "timeStamp": 1609685584
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "name": "TempActive1Sensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive1Sensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor3",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor4",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "O2ExhaustSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "CH4ExhaustSensor1",
                        "type": "Temperature",
                        "isRunning": true
                    }
                ],
                "sensorData": [
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 58.3,
                        "timeStamp": 1609727692
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 5.1,
                        "timeStamp": 1609764991
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 56.8,
                        "timeStamp": 1609764895
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 23.3,
                        "timeStamp": 1609799393
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 78.3,
                        "timeStamp": 1609779556
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 2.2,
                        "timeStamp": 1609799940
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 96.7,
                        "timeStamp": 1609737971
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 56.3,
                        "timeStamp": 1609775887
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 16.0,
                        "timeStamp": 1609744198
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 38.7,
                        "timeStamp": 1609757056
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 85.7,
                        "timeStamp": 1609771071
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 94.4,
                        "timeStamp": 1609795484
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 49.7,
                        "timeStamp": 1609768807
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 46.0,
                        "timeStamp": 1609724774
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 65.9,
                        "timeStamp": 1609728331
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 68.8,
                        "timeStamp": 1609775696
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 28.5,
                        "timeStamp": 1609739287
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 33.4,
                        "timeStamp": 1609731236
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 35.9,
                        "timeStamp": 1609797661
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 77.1,
                        "timeStamp": 1609774914
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 2.7,
                        "timeStamp": 1609736882
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 80.9,
                        "timeStamp": 1609740098
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 41.2,
                        "timeStamp": 1609743704
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 97.4,
                        "timeStamp": 1609752908
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 41.5,
                        "timeStamp": 1609776940
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 7.0,
                        "timeStamp": 1609782240
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 87.2,
                        "timeStamp": 1609773607
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 9.7,
                        "timeStamp": 1609739496
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 6.3,
                        "timeStamp": 1609766810
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 29.0,
                        "timeStamp": 1609765120
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 14.0,
                        "timeStamp": 1609791682
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 9.7,
                        "timeStamp": 1609727117
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 47.6,
                        "timeStamp": 1609766984
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 12.4,
                        "timeStamp": 1609746510
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 82.9,
                        "timeStamp": 1609791251
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 5.0,
                        "timeStamp": 1609773977
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 94.3,
                        "timeStamp": 1609723694
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 17.3,
                        "timeStamp": 1609771174
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 18.5,
                        "timeStamp": 1609723363
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 87.6,
                        "timeStamp": 1609787115
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 34.0,
                        "timeStamp": 1609737578
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 45.6,
                        "timeStamp": 1609792126
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 49.5,
                        "timeStamp": 1609755211
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 5.6,
                        "timeStamp": 1609760675
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 26.5,
                        "timeStamp": 1609799853
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 76.6,
                        "timeStamp": 1609722950
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 32.5,
                        "timeStamp": 1609758470
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 83.1,
                        "timeStamp": 1609768636
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 2.4,
                        "timeStamp": 1609750845
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 7.0,
                        "timeStamp": 1609795676
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 67.9,
                        "timeStamp": 1609796401
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 93.1,
                        "timeStamp": 1609723316
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 97.4,
                        "timeStamp": 1609725627
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 32.8,
                        "timeStamp": 1609790910
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 28.6,
                        "timeStamp": 1609803361
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 44.6,
                        "timeStamp": 1609760852
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 45.2,
                        "timeStamp": 1609755521
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 29.8,
                        "timeStamp": 1609796309
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 41.0,
                        "timeStamp": 1609800504
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 26.9,
                        "timeStamp": 1609775693
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 96.4,
                        "timeStamp": 1609747117
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 96.0,
                        "timeStamp": 1609776591
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 25.6,
                        "timeStamp": 1609763396
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 79.1,
                        "timeStamp": 1609749846
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 71.4,
                        "timeStamp": 1609733374
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 20.8,
                        "timeStamp": 1609795373
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 18.5,
                        "timeStamp": 1609791409
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 87.7,
                        "timeStamp": 1609748775
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 14.9,
                        "timeStamp": 1609736508
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 9.0,
                        "timeStamp": 1609765828
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 49.0,
                        "timeStamp": 1609733653
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 29.7,
                        "timeStamp": 1609737849
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 4.0,
                        "timeStamp": 1609751101
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 52.3,
                        "timeStamp": 1609783302
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 13.9,
                        "timeStamp": 1609727664
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 28.1,
                        "timeStamp": 1609766625
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 3.8,
                        "timeStamp": 1609790119
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 87.2,
                        "timeStamp": 1609755953
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 60.9,
                        "timeStamp": 1609757435
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 36.2,
                        "timeStamp": 1609755454
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 82.7,
                        "timeStamp": 1609792174
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 90.0,
                        "timeStamp": 1609789535
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 91.1,
                        "timeStamp": 1609738820
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 88.6,
                        "timeStamp": 1609773885
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 12.7,
                        "timeStamp": 1609748161
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 48.8,
                        "timeStamp": 1609795612
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 51.3,
                        "timeStamp": 1609758599
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 94.1,
                        "timeStamp": 1609788541
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 49.9,
                        "timeStamp": 1609726849
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 10.9,
                        "timeStamp": 1609773993
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 13.1,
                        "timeStamp": 1609786620
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 38.7,
                        "timeStamp": 1609801375
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 20.1,
                        "timeStamp": 1609745904
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 0.8,
                        "timeStamp": 1609788442
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 50.5,
                        "timeStamp": 1609791692
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 43.8,
                        "timeStamp": 1609758979
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 3.3,
                        "timeStamp": 1609721509
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 26.1,
                        "timeStamp": 1609799492
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 37.5,
                        "timeStamp": 1609756872
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 58.1,
                        "timeStamp": 1609733469
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "name": "TempActive1Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive1Sensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor3",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor4",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "O2ExhaustSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "CH4ExhaustSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    }
                ],
                "sensorData": [
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 19.3,
                        "timeStamp": 1609877328
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 79.9,
                        "timeStamp": 1609878930
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 63.6,
                        "timeStamp": 1609860365
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 80.1,
                        "timeStamp": 1609879459
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 82.6,
                        "timeStamp": 1609863830
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 44.7,
                        "timeStamp": 1609829791
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 46.2,
                        "timeStamp": 1609884612
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 76.3,
                        "timeStamp": 1609820257
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 56.4,
                        "timeStamp": 1609874696
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 93.5,
                        "timeStamp": 1609837007
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 12.6,
                        "timeStamp": 1609881050
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 63.0,
                        "timeStamp": 1609819903
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 15.6,
                        "timeStamp": 1609823734
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 12.9,
                        "timeStamp": 1609834807
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 87.0,
                        "timeStamp": 1609838715
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 46.2,
                        "timeStamp": 1609807090
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 87.8,
                        "timeStamp": 1609809449
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 25.2,
                        "timeStamp": 1609857790
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 22.0,
                        "timeStamp": 1609840519
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 77.7,
                        "timeStamp": 1609865698
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 17.9,
                        "timeStamp": 1609882498
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 9.9,
                        "timeStamp": 1609852482
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 13.4,
                        "timeStamp": 1609844826
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 80.5,
                        "timeStamp": 1609872882
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 67.4,
                        "timeStamp": 1609848183
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 22.5,
                        "timeStamp": 1609884166
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 3.4,
                        "timeStamp": 1609886733
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 57.9,
                        "timeStamp": 1609812548
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 77.6,
                        "timeStamp": 1609882751
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 70.7,
                        "timeStamp": 1609840499
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 83.3,
                        "timeStamp": 1609875678
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 6.3,
                        "timeStamp": 1609838548
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 56.3,
                        "timeStamp": 1609857707
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 69.9,
                        "timeStamp": 1609840823
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 49.0,
                        "timeStamp": 1609881890
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 98.8,
                        "timeStamp": 1609842100
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 78.1,
                        "timeStamp": 1609847574
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 70.4,
                        "timeStamp": 1609846029
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 27.6,
                        "timeStamp": 1609881739
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 29.8,
                        "timeStamp": 1609811195
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 1.9,
                        "timeStamp": 1609891030
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 35.3,
                        "timeStamp": 1609863460
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 93.9,
                        "timeStamp": 1609851687
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 33.4,
                        "timeStamp": 1609816883
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 71.0,
                        "timeStamp": 1609880494
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 76.1,
                        "timeStamp": 1609850826
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 98.0,
                        "timeStamp": 1609865876
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 57.6,
                        "timeStamp": 1609820936
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 82.8,
                        "timeStamp": 1609837846
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 99.3,
                        "timeStamp": 1609888202
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 96.4,
                        "timeStamp": 1609842088
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 57.6,
                        "timeStamp": 1609863975
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 93.9,
                        "timeStamp": 1609841932
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 16.3,
                        "timeStamp": 1609844352
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 99.6,
                        "timeStamp": 1609835202
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 50.7,
                        "timeStamp": 1609877966
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 55.9,
                        "timeStamp": 1609837270
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 35.1,
                        "timeStamp": 1609860780
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 93.2,
                        "timeStamp": 1609835504
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 66.8,
                        "timeStamp": 1609839457
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 95.6,
                        "timeStamp": 1609845959
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 39.8,
                        "timeStamp": 1609810734
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 2.2,
                        "timeStamp": 1609826948
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 66.2,
                        "timeStamp": 1609823312
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 11.2,
                        "timeStamp": 1609832158
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 15.5,
                        "timeStamp": 1609820940
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 59.6,
                        "timeStamp": 1609831957
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 63.4,
                        "timeStamp": 1609823125
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 83.9,
                        "timeStamp": 1609865722
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 28.1,
                        "timeStamp": 1609848387
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 69.3,
                        "timeStamp": 1609877533
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 87.9,
                        "timeStamp": 1609829239
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 3.1,
                        "timeStamp": 1609812965
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 52.1,
                        "timeStamp": 1609835527
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 79.1,
                        "timeStamp": 1609886496
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 37.1,
                        "timeStamp": 1609876456
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 83.9,
                        "timeStamp": 1609809698
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 72.9,
                        "timeStamp": 1609878972
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 41.0,
                        "timeStamp": 1609843487
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 94.6,
                        "timeStamp": 1609865770
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 14.7,
                        "timeStamp": 1609843083
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 76.4,
                        "timeStamp": 1609840307
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 83.5,
                        "timeStamp": 1609873837
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 61.0,
                        "timeStamp": 1609883082
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 30.8,
                        "timeStamp": 1609888199
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 70.6,
                        "timeStamp": 1609879682
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 53.4,
                        "timeStamp": 1609811275
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 41.7,
                        "timeStamp": 1609883891
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 49.1,
                        "timeStamp": 1609805286
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 56.5,
                        "timeStamp": 1609839517
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 92.7,
                        "timeStamp": 1609879129
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 55.7,
                        "timeStamp": 1609865053
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 75.8,
                        "timeStamp": 1609819081
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 5.2,
                        "timeStamp": 1609858550
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 51.7,
                        "timeStamp": 1609886256
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 15.6,
                        "timeStamp": 1609877438
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 53.7,
                        "timeStamp": 1609805690
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 17.6,
                        "timeStamp": 1609858511
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 12.9,
                        "timeStamp": 1609842155
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 67.4,
                        "timeStamp": 1609870744
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "name": "TempActive1Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive1Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor3",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor4",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "O2ExhaustSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "CH4ExhaustSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    }
                ],
                "sensorData": [
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 90.0,
                        "timeStamp": 1609918838
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 86.2,
                        "timeStamp": 1609953229
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 79.6,
                        "timeStamp": 1609953807
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 70.0,
                        "timeStamp": 1609900360
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 94.6,
                        "timeStamp": 1609904502
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 86.4,
                        "timeStamp": 1609962836
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 68.9,
                        "timeStamp": 1609897719
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 93.3,
                        "timeStamp": 1609925889
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 94.6,
                        "timeStamp": 1609970230
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 79.8,
                        "timeStamp": 1609928284
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 55.9,
                        "timeStamp": 1609907475
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 72.8,
                        "timeStamp": 1609977467
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 90.2,
                        "timeStamp": 1609966835
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 77.2,
                        "timeStamp": 1609933985
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 89.0,
                        "timeStamp": 1609894483
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 91.6,
                        "timeStamp": 1609922352
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 49.7,
                        "timeStamp": 1609894046
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 48.8,
                        "timeStamp": 1609916299
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 2.7,
                        "timeStamp": 1609935581
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 58.2,
                        "timeStamp": 1609942205
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 87.2,
                        "timeStamp": 1609962131
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 6.3,
                        "timeStamp": 1609942384
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 9.0,
                        "timeStamp": 1609958843
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 93.7,
                        "timeStamp": 1609941566
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 37.7,
                        "timeStamp": 1609960573
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 31.0,
                        "timeStamp": 1609951491
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 2.4,
                        "timeStamp": 1609929324
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 10.4,
                        "timeStamp": 1609915058
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 86.7,
                        "timeStamp": 1609938450
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 79.2,
                        "timeStamp": 1609907355
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 15.5,
                        "timeStamp": 1609977520
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 68.6,
                        "timeStamp": 1609938031
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 63.0,
                        "timeStamp": 1609949314
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 37.4,
                        "timeStamp": 1609953277
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 54.1,
                        "timeStamp": 1609953338
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 6.0,
                        "timeStamp": 1609921128
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 4.6,
                        "timeStamp": 1609924761
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 87.3,
                        "timeStamp": 1609904742
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 96.5,
                        "timeStamp": 1609899063
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 63.9,
                        "timeStamp": 1609924773
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 61.0,
                        "timeStamp": 1609927396
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 86.3,
                        "timeStamp": 1609940527
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 39.3,
                        "timeStamp": 1609922758
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 80.9,
                        "timeStamp": 1609932794
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 52.1,
                        "timeStamp": 1609960778
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 18.0,
                        "timeStamp": 1609973359
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 64.6,
                        "timeStamp": 1609924529
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 90.0,
                        "timeStamp": 1609969474
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 10.6,
                        "timeStamp": 1609922921
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 45.0,
                        "timeStamp": 1609970807
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 21.0,
                        "timeStamp": 1609926007
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 55.4,
                        "timeStamp": 1609957643
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 54.9,
                        "timeStamp": 1609900529
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 34.9,
                        "timeStamp": 1609927249
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 67.2,
                        "timeStamp": 1609933463
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 30.8,
                        "timeStamp": 1609908273
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 37.3,
                        "timeStamp": 1609948119
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 96.7,
                        "timeStamp": 1609931074
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 61.0,
                        "timeStamp": 1609908521
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 13.8,
                        "timeStamp": 1609961022
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 22.7,
                        "timeStamp": 1609959958
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 60.3,
                        "timeStamp": 1609893950
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 85.0,
                        "timeStamp": 1609935962
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 56.4,
                        "timeStamp": 1609908800
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 32.7,
                        "timeStamp": 1609953538
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 80.7,
                        "timeStamp": 1609971676
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 99.8,
                        "timeStamp": 1609927767
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 2.4,
                        "timeStamp": 1609909616
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 5.2,
                        "timeStamp": 1609894393
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 68.6,
                        "timeStamp": 1609959261
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 13.5,
                        "timeStamp": 1609916840
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 55.3,
                        "timeStamp": 1609895298
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 3.7,
                        "timeStamp": 1609903664
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 93.3,
                        "timeStamp": 1609905759
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 51.3,
                        "timeStamp": 1609928231
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 30.7,
                        "timeStamp": 1609969939
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 23.5,
                        "timeStamp": 1609903880
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 15.5,
                        "timeStamp": 1609915566
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 22.6,
                        "timeStamp": 1609902906
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 21.1,
                        "timeStamp": 1609928404
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 96.9,
                        "timeStamp": 1609929847
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 42.7,
                        "timeStamp": 1609922955
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 49.4,
                        "timeStamp": 1609952964
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 3.6,
                        "timeStamp": 1609928087
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 63.9,
                        "timeStamp": 1609924310
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 15.6,
                        "timeStamp": 1609966436
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 16.4,
                        "timeStamp": 1609920044
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 73.8,
                        "timeStamp": 1609974130
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 70.3,
                        "timeStamp": 1609951100
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 55.0,
                        "timeStamp": 1609953264
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 41.9,
                        "timeStamp": 1609894063
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 83.3,
                        "timeStamp": 1609928689
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 57.2,
                        "timeStamp": 1609954724
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 27.1,
                        "timeStamp": 1609912705
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 37.1,
                        "timeStamp": 1609915104
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 58.7,
                        "timeStamp": 1609975769
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 78.5,
                        "timeStamp": 1609918371
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 7.9,
                        "timeStamp": 1609901722
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 66.7,
                        "timeStamp": 1609895099
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 74.5,
                        "timeStamp": 1609956759
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "name": "TempActive1Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive1Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor3",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor4",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "O2ExhaustSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "CH4ExhaustSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    }
                ],
                "sensorData": [
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 88.8,
                        "timeStamp": 1610019436
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 71.3,
                        "timeStamp": 1609994723
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 9.1,
                        "timeStamp": 1610062290
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 51.4,
                        "timeStamp": 1610019505
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 91.9,
                        "timeStamp": 1609984150
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 8.0,
                        "timeStamp": 1609977958
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 35.0,
                        "timeStamp": 1609992511
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 83.4,
                        "timeStamp": 1610001383
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 79.7,
                        "timeStamp": 1609984745
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 74.8,
                        "timeStamp": 1609996826
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 96.8,
                        "timeStamp": 1610020664
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 62.1,
                        "timeStamp": 1609981470
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 39.7,
                        "timeStamp": 1610030575
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 40.3,
                        "timeStamp": 1609980265
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 87.4,
                        "timeStamp": 1610014325
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 92.5,
                        "timeStamp": 1609995025
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 66.5,
                        "timeStamp": 1609978083
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 2.6,
                        "timeStamp": 1610004460
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 85.5,
                        "timeStamp": 1610007303
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 59.3,
                        "timeStamp": 1610055705
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 10.0,
                        "timeStamp": 1610011694
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 60.0,
                        "timeStamp": 1610000606
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 9.8,
                        "timeStamp": 1609994230
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 63.8,
                        "timeStamp": 1609993951
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 5.3,
                        "timeStamp": 1610024300
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 92.6,
                        "timeStamp": 1610028723
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 46.1,
                        "timeStamp": 1610027228
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 6.9,
                        "timeStamp": 1610000984
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 37.4,
                        "timeStamp": 1609996177
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 28.7,
                        "timeStamp": 1610013990
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 80.1,
                        "timeStamp": 1610007755
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 91.8,
                        "timeStamp": 1610054107
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 33.5,
                        "timeStamp": 1610047571
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 60.6,
                        "timeStamp": 1609981319
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 62.8,
                        "timeStamp": 1610007121
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 86.0,
                        "timeStamp": 1609984268
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 39.3,
                        "timeStamp": 1610005485
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 87.9,
                        "timeStamp": 1609978717
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 81.8,
                        "timeStamp": 1609987054
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 98.1,
                        "timeStamp": 1609983894
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 25.6,
                        "timeStamp": 1610013919
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 29.2,
                        "timeStamp": 1610004910
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 35.8,
                        "timeStamp": 1610045029
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 1.9,
                        "timeStamp": 1609998101
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 51.8,
                        "timeStamp": 1610059980
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 61.5,
                        "timeStamp": 1610021743
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 62.5,
                        "timeStamp": 1610040700
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 59.1,
                        "timeStamp": 1609986350
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 52.2,
                        "timeStamp": 1610010445
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 43.7,
                        "timeStamp": 1610022817
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 76.5,
                        "timeStamp": 1610049007
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 64.4,
                        "timeStamp": 1610023168
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 94.9,
                        "timeStamp": 1610047382
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 38.9,
                        "timeStamp": 1610033601
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 52.1,
                        "timeStamp": 1610011994
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 29.4,
                        "timeStamp": 1610057149
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 12.1,
                        "timeStamp": 1609979078
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 99.3,
                        "timeStamp": 1610060430
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 66.0,
                        "timeStamp": 1610057982
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 3.4,
                        "timeStamp": 1610002790
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 67.8,
                        "timeStamp": 1610056160
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 32.1,
                        "timeStamp": 1610018044
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 73.0,
                        "timeStamp": 1610023547
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 21.9,
                        "timeStamp": 1609989307
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 74.3,
                        "timeStamp": 1610040724
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 63.6,
                        "timeStamp": 1609999024
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 25.5,
                        "timeStamp": 1610032663
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 89.2,
                        "timeStamp": 1609985761
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 23.9,
                        "timeStamp": 1610021504
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 19.7,
                        "timeStamp": 1610036970
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 74.9,
                        "timeStamp": 1610007768
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 46.9,
                        "timeStamp": 1610033720
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 22.2,
                        "timeStamp": 1609991429
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 70.7,
                        "timeStamp": 1610011040
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 20.0,
                        "timeStamp": 1610061168
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 18.7,
                        "timeStamp": 1610013127
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 39.1,
                        "timeStamp": 1610010907
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 79.7,
                        "timeStamp": 1610037757
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 70.2,
                        "timeStamp": 1610004505
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 61.0,
                        "timeStamp": 1610044767
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 81.4,
                        "timeStamp": 1610017438
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 89.9,
                        "timeStamp": 1610043443
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 56.7,
                        "timeStamp": 1610034667
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 66.6,
                        "timeStamp": 1610021453
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 5.6,
                        "timeStamp": 1610030365
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 90.0,
                        "timeStamp": 1610030899
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 80.1,
                        "timeStamp": 1610027504
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 38.5,
                        "timeStamp": 1609997846
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 43.2,
                        "timeStamp": 1610030845
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 90.5,
                        "timeStamp": 1609986184
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 0.7,
                        "timeStamp": 1610008025
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 1.0,
                        "timeStamp": 1610015401
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 6.5,
                        "timeStamp": 1610019412
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 63.9,
                        "timeStamp": 1610025771
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 13.2,
                        "timeStamp": 1610053690
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 17.9,
                        "timeStamp": 1609980284
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 25.4,
                        "timeStamp": 1610050345
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 32.8,
                        "timeStamp": 1610018622
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 15.6,
                        "timeStamp": 1609991420
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 2.4,
                        "timeStamp": 1610048304
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "name": "TempActive1Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive1Sensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor3",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor4",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "O2ExhaustSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "CH4ExhaustSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    }
                ],
                "sensorData": [
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 26.7,
                        "timeStamp": 1610109949
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 0.1,
                        "timeStamp": 1610087269
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 52.8,
                        "timeStamp": 1610093602
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 8.3,
                        "timeStamp": 1610096636
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 11.5,
                        "timeStamp": 1610134044
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 97.1,
                        "timeStamp": 1610133895
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 75.9,
                        "timeStamp": 1610092965
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 27.0,
                        "timeStamp": 1610120458
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 56.1,
                        "timeStamp": 1610125942
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 29.7,
                        "timeStamp": 1610088280
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 17.9,
                        "timeStamp": 1610124501
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 20.8,
                        "timeStamp": 1610132817
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 24.1,
                        "timeStamp": 1610129608
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 53.2,
                        "timeStamp": 1610125322
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 5.6,
                        "timeStamp": 1610069153
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 30.7,
                        "timeStamp": 1610121100
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 59.2,
                        "timeStamp": 1610093679
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 18.7,
                        "timeStamp": 1610089794
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 25.1,
                        "timeStamp": 1610071159
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 52.9,
                        "timeStamp": 1610128484
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 63.4,
                        "timeStamp": 1610110539
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 44.3,
                        "timeStamp": 1610138525
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 10.1,
                        "timeStamp": 1610107083
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 30.7,
                        "timeStamp": 1610079566
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 3.1,
                        "timeStamp": 1610124618
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 91.1,
                        "timeStamp": 1610084750
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 12.4,
                        "timeStamp": 1610091470
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 77.5,
                        "timeStamp": 1610099249
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 45.6,
                        "timeStamp": 1610097832
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 45.6,
                        "timeStamp": 1610067017
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 18.1,
                        "timeStamp": 1610088603
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 73.3,
                        "timeStamp": 1610149474
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 70.9,
                        "timeStamp": 1610069372
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 39.9,
                        "timeStamp": 1610143387
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 61.7,
                        "timeStamp": 1610121441
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 33.4,
                        "timeStamp": 1610117219
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 11.1,
                        "timeStamp": 1610117720
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 26.6,
                        "timeStamp": 1610141901
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 38.8,
                        "timeStamp": 1610067460
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 68.3,
                        "timeStamp": 1610100406
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 17.2,
                        "timeStamp": 1610131280
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 25.1,
                        "timeStamp": 1610114950
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 19.9,
                        "timeStamp": 1610077491
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 95.3,
                        "timeStamp": 1610085017
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 55.7,
                        "timeStamp": 1610083379
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 73.8,
                        "timeStamp": 1610068097
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 67.8,
                        "timeStamp": 1610101417
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 28.8,
                        "timeStamp": 1610144509
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 0.4,
                        "timeStamp": 1610086918
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 19.8,
                        "timeStamp": 1610145016
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 71.1,
                        "timeStamp": 1610076005
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 83.0,
                        "timeStamp": 1610101181
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 34.8,
                        "timeStamp": 1610114148
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 57.5,
                        "timeStamp": 1610142043
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 93.9,
                        "timeStamp": 1610138865
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 59.7,
                        "timeStamp": 1610112918
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 48.7,
                        "timeStamp": 1610149483
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 40.8,
                        "timeStamp": 1610133709
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 61.7,
                        "timeStamp": 1610097239
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 76.1,
                        "timeStamp": 1610088996
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 42.2,
                        "timeStamp": 1610093755
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 34.6,
                        "timeStamp": 1610073219
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 88.5,
                        "timeStamp": 1610090136
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 19.5,
                        "timeStamp": 1610086309
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 81.7,
                        "timeStamp": 1610085672
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 57.6,
                        "timeStamp": 1610109742
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 21.7,
                        "timeStamp": 1610106370
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 29.9,
                        "timeStamp": 1610085259
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 99.8,
                        "timeStamp": 1610078604
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 47.5,
                        "timeStamp": 1610142247
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 98.7,
                        "timeStamp": 1610086259
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 64.5,
                        "timeStamp": 1610070215
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 54.1,
                        "timeStamp": 1610098367
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 0.0,
                        "timeStamp": 1610082699
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 55.1,
                        "timeStamp": 1610113550
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 6.6,
                        "timeStamp": 1610102290
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 73.8,
                        "timeStamp": 1610070624
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 7.2,
                        "timeStamp": 1610095643
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 60.1,
                        "timeStamp": 1610065280
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 83.3,
                        "timeStamp": 1610133002
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 72.1,
                        "timeStamp": 1610073965
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 85.6,
                        "timeStamp": 1610086899
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 71.1,
                        "timeStamp": 1610135467
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 57.3,
                        "timeStamp": 1610083272
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 49.1,
                        "timeStamp": 1610133757
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 22.3,
                        "timeStamp": 1610072795
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 76.0,
                        "timeStamp": 1610120441
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 0.4,
                        "timeStamp": 1610082723
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 47.9,
                        "timeStamp": 1610118966
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 33.6,
                        "timeStamp": 1610124443
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 75.1,
                        "timeStamp": 1610107739
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 37.5,
                        "timeStamp": 1610149255
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 20.6,
                        "timeStamp": 1610139967
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 50.0,
                        "timeStamp": 1610128465
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 27.1,
                        "timeStamp": 1610127267
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 82.7,
                        "timeStamp": 1610071195
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 98.2,
                        "timeStamp": 1610101077
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 22.8,
                        "timeStamp": 1610116818
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 79.2,
                        "timeStamp": 1610132727
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 97.1,
                        "timeStamp": 1610098607
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "name": "TempActive1Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive1Sensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor3",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor4",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor1",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "O2ExhaustSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "CH4ExhaustSensor1",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    }
                ],
                "sensorData": [
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 60.1,
                        "timeStamp": 1610211030
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 79.5,
                        "timeStamp": 1610213230
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 88.5,
                        "timeStamp": 1610187981
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 34.0,
                        "timeStamp": 1610176912
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 62.5,
                        "timeStamp": 1610196645
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 4.9,
                        "timeStamp": 1610172948
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 81.4,
                        "timeStamp": 1610190918
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 31.4,
                        "timeStamp": 1610155867
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 37.3,
                        "timeStamp": 1610157964
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 92.4,
                        "timeStamp": 1610222668
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 10.5,
                        "timeStamp": 1610164184
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 49.5,
                        "timeStamp": 1610196294
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 28.7,
                        "timeStamp": 1610168809
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 29.6,
                        "timeStamp": 1610162838
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 88.2,
                        "timeStamp": 1610153860
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 93.6,
                        "timeStamp": 1610219118
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 92.9,
                        "timeStamp": 1610200127
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 66.4,
                        "timeStamp": 1610208817
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 11.8,
                        "timeStamp": 1610227797
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 96.8,
                        "timeStamp": 1610178154
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 0.3,
                        "timeStamp": 1610210127
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 59.2,
                        "timeStamp": 1610193257
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 51.4,
                        "timeStamp": 1610159439
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 74.6,
                        "timeStamp": 1610174487
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 28.7,
                        "timeStamp": 1610229464
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 95.2,
                        "timeStamp": 1610204917
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 29.6,
                        "timeStamp": 1610208299
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 15.0,
                        "timeStamp": 1610150906
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 94.3,
                        "timeStamp": 1610224233
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 96.1,
                        "timeStamp": 1610194466
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 64.7,
                        "timeStamp": 1610186896
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 97.1,
                        "timeStamp": 1610164463
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 12.9,
                        "timeStamp": 1610156231
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 28.4,
                        "timeStamp": 1610154650
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 27.5,
                        "timeStamp": 1610160880
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 72.2,
                        "timeStamp": 1610214445
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 32.3,
                        "timeStamp": 1610154222
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 36.3,
                        "timeStamp": 1610214730
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 26.4,
                        "timeStamp": 1610195784
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 33.8,
                        "timeStamp": 1610157808
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 36.0,
                        "timeStamp": 1610164866
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 69.5,
                        "timeStamp": 1610180408
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 74.5,
                        "timeStamp": 1610235249
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 56.2,
                        "timeStamp": 1610181478
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 67.9,
                        "timeStamp": 1610160148
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 31.2,
                        "timeStamp": 1610179009
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 18.1,
                        "timeStamp": 1610187129
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 50.0,
                        "timeStamp": 1610157996
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 8.6,
                        "timeStamp": 1610164422
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 67.3,
                        "timeStamp": 1610182696
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 15.2,
                        "timeStamp": 1610221315
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 69.5,
                        "timeStamp": 1610173045
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 45.3,
                        "timeStamp": 1610203456
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 59.6,
                        "timeStamp": 1610155618
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 32.4,
                        "timeStamp": 1610229118
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 32.1,
                        "timeStamp": 1610154068
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 67.1,
                        "timeStamp": 1610222715
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 7.4,
                        "timeStamp": 1610196816
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 56.2,
                        "timeStamp": 1610213410
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 56.7,
                        "timeStamp": 1610224031
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 26.2,
                        "timeStamp": 1610217265
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 16.1,
                        "timeStamp": 1610168909
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 97.5,
                        "timeStamp": 1610171779
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 42.4,
                        "timeStamp": 1610226983
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 28.4,
                        "timeStamp": 1610181287
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 64.4,
                        "timeStamp": 1610224432
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 75.3,
                        "timeStamp": 1610203747
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 62.8,
                        "timeStamp": 1610225872
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 41.3,
                        "timeStamp": 1610219194
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 16.4,
                        "timeStamp": 1610227286
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 77.5,
                        "timeStamp": 1610183330
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 23.7,
                        "timeStamp": 1610182851
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 8.0,
                        "timeStamp": 1610172184
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 75.2,
                        "timeStamp": 1610224121
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 69.8,
                        "timeStamp": 1610217661
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 13.5,
                        "timeStamp": 1610173495
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 20.2,
                        "timeStamp": 1610217347
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 38.8,
                        "timeStamp": 1610204690
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 22.9,
                        "timeStamp": 1610162082
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 16.7,
                        "timeStamp": 1610161492
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 20.3,
                        "timeStamp": 1610233707
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 64.3,
                        "timeStamp": 1610228379
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 6.9,
                        "timeStamp": 1610164266
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 27.4,
                        "timeStamp": 1610171860
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 2.4,
                        "timeStamp": 1610156202
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 11.3,
                        "timeStamp": 1610161412
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 17.2,
                        "timeStamp": 1610181861
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 39.4,
                        "timeStamp": 1610188204
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 19.1,
                        "timeStamp": 1610177457
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 83.9,
                        "timeStamp": 1610217629
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 15.8,
                        "timeStamp": 1610189379
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 43.4,
                        "timeStamp": 1610225885
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 68.5,
                        "timeStamp": 1610182587
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 97.8,
                        "timeStamp": 1610205885
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 86.9,
                        "timeStamp": 1610203493
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 58.5,
                        "timeStamp": 1610182456
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 89.8,
                        "timeStamp": 1610231979
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 65.8,
                        "timeStamp": 1610173589
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 8.1,
                        "timeStamp": 1610200615
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 30.5,
                        "timeStamp": 1610188161
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "name": "TempActive1Sensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive1Sensor2",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempActive2Sensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor3",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "TempCuringSensor4",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive1Sensor2",
                        "type": "Temperature",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "MoistActive2Sensor2",
                        "type": "Carbon dioxide",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor1",
                        "type": "Moisture",
                        "isRunning": true
                    },
                    {
                        "name": "MoistCuringSensor2",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "O2ExhaustSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    },
                    {
                        "name": "CH4ExhaustSensor1",
                        "type": "Oxygen",
                        "isRunning": true
                    }
                ],
                "sensorData": [
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 5.5,
                        "timeStamp": 1610266678
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 29.2,
                        "timeStamp": 1610299185
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 51.7,
                        "timeStamp": 1610245678
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 51.2,
                        "timeStamp": 1610285757
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 77.7,
                        "timeStamp": 1610313901
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 20.9,
                        "timeStamp": 1610318810
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 78.4,
                        "timeStamp": 1610263022
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 94.0,
                        "timeStamp": 1610277030
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 90.1,
                        "timeStamp": 1610248835
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 72.0,
                        "timeStamp": 1610246577
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 48.9,
                        "timeStamp": 1610305376
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 15.2,
                        "timeStamp": 1610243244
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 75.8,
                        "timeStamp": 1610307358
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 36.9,
                        "timeStamp": 1610255478
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 86.9,
                        "timeStamp": 1610321267
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 33.3,
                        "timeStamp": 1610302170
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 88.7,
                        "timeStamp": 1610289292
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 4.3,
                        "timeStamp": 1610240982
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 90.7,
                        "timeStamp": 1610306395
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 97.7,
                        "timeStamp": 1610323109
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 31.3,
                        "timeStamp": 1610286720
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 56.8,
                        "timeStamp": 1610296323
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 58.4,
                        "timeStamp": 1610244393
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 16.9,
                        "timeStamp": 1610271496
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 90.9,
                        "timeStamp": 1610319655
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 15.4,
                        "timeStamp": 1610270807
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 82.4,
                        "timeStamp": 1610268720
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 76.0,
                        "timeStamp": 1610259356
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 89.6,
                        "timeStamp": 1610289850
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 64.2,
                        "timeStamp": 1610254290
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 4.7,
                        "timeStamp": 1610280314
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 66.7,
                        "timeStamp": 1610305244
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 10.7,
                        "timeStamp": 1610297909
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 1.2,
                        "timeStamp": 1610274597
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 68.0,
                        "timeStamp": 1610273840
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 66.1,
                        "timeStamp": 1610267126
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 32.6,
                        "timeStamp": 1610304496
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 52.9,
                        "timeStamp": 1610252151
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 92.4,
                        "timeStamp": 1610263520
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 84.7,
                        "timeStamp": 1610283202
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 17.8,
                        "timeStamp": 1610299242
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 99.3,
                        "timeStamp": 1610291800
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 24.2,
                        "timeStamp": 1610292812
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 38.0,
                        "timeStamp": 1610302031
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 51.0,
                        "timeStamp": 1610274674
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 98.5,
                        "timeStamp": 1610258020
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 41.9,
                        "timeStamp": 1610280188
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 51.0,
                        "timeStamp": 1610316525
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 98.2,
                        "timeStamp": 1610317165
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 9.8,
                        "timeStamp": 1610240715
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 39.8,
                        "timeStamp": 1610263352
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 46.7,
                        "timeStamp": 1610253336
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 49.7,
                        "timeStamp": 1610304777
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 77.3,
                        "timeStamp": 1610314781
                    },
                    {
                        "sensorName": "MoistActive2Sensor2",
                        "value": 92.4,
                        "timeStamp": 1610308758
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 83.7,
                        "timeStamp": 1610269932
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 97.2,
                        "timeStamp": 1610273633
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 9.9,
                        "timeStamp": 1610257307
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 10.6,
                        "timeStamp": 1610293129
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 71.9,
                        "timeStamp": 1610249830
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 86.6,
                        "timeStamp": 1610276089
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 84.0,
                        "timeStamp": 1610238017
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 47.9,
                        "timeStamp": 1610270321
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 72.9,
                        "timeStamp": 1610300125
                    },
                    {
                        "sensorName": "TempCuringSensor1",
                        "value": 88.9,
                        "timeStamp": 1610278310
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 81.8,
                        "timeStamp": 1610311687
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 44.6,
                        "timeStamp": 1610288777
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 57.4,
                        "timeStamp": 1610285764
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 58.5,
                        "timeStamp": 1610283474
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 20.2,
                        "timeStamp": 1610306969
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 41.3,
                        "timeStamp": 1610237696
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 31.7,
                        "timeStamp": 1610258073
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 55.0,
                        "timeStamp": 1610261621
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 98.4,
                        "timeStamp": 1610266244
                    },
                    {
                        "sensorName": "MoistCuringSensor2",
                        "value": 97.0,
                        "timeStamp": 1610242938
                    },
                    {
                        "sensorName": "TempActive2Sensor2",
                        "value": 24.8,
                        "timeStamp": 1610256747
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 77.5,
                        "timeStamp": 1610305553
                    },
                    {
                        "sensorName": "MoistActive1Sensor1",
                        "value": 92.0,
                        "timeStamp": 1610315480
                    },
                    {
                        "sensorName": "TempActive1Sensor2",
                        "value": 64.7,
                        "timeStamp": 1610274601
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 66.2,
                        "timeStamp": 1610277362
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 22.0,
                        "timeStamp": 1610255429
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 74.9,
                        "timeStamp": 1610319953
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 54.7,
                        "timeStamp": 1610321110
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 44.0,
                        "timeStamp": 1610251663
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 45.6,
                        "timeStamp": 1610304467
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 26.2,
                        "timeStamp": 1610276313
                    },
                    {
                        "sensorName": "CH4ExhaustSensor1",
                        "value": 88.1,
                        "timeStamp": 1610260930
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 19.8,
                        "timeStamp": 1610236885
                    },
                    {
                        "sensorName": "TempCuringSensor4",
                        "value": 52.8,
                        "timeStamp": 1610244289
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 37.7,
                        "timeStamp": 1610250965
                    },
                    {
                        "sensorName": "TempCuringSensor3",
                        "value": 40.2,
                        "timeStamp": 1610252694
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 50.2,
                        "timeStamp": 1610254761
                    },
                    {
                        "sensorName": "TempCuringSensor2",
                        "value": 42.5,
                        "timeStamp": 1610316487
                    },
                    {
                        "sensorName": "TempActive2Sensor1",
                        "value": 67.3,
                        "timeStamp": 1610290136
                    },
                    {
                        "sensorName": "MoistCuringSensor1",
                        "value": 42.9,
                        "timeStamp": 1610296781
                    },
                    {
                        "sensorName": "TempActive1Sensor1",
                        "value": 82.9,
                        "timeStamp": 1610275617
                    },
                    {
                        "sensorName": "MoistActive1Sensor2",
                        "value": 31.4,
                        "timeStamp": 1610258700
                    },
                    {
                        "sensorName": "MoistActive2Sensor1",
                        "value": 44.7,
                        "timeStamp": 1610247096
                    },
                    {
                        "sensorName": "O2ExhaustSensor1",
                        "value": 7.1,
                        "timeStamp": 1610311185
                    },
                    {
                        "sensorName": "CO2ExhaustSensor1",
                        "value": 51.4,
                        "timeStamp": 1610301152
                    }
                ]
            }
        ],
        "logs": [
            {
                "sensor": [
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609470138
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609467539
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609501279
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609494715
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609545572
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609532385
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609463953
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609532362
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609526223
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609514870
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609495150
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609494358
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609469629
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609491935
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609516595
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609521484
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609493699
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609500462
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609496792
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609531521
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609500749
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609538145
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609492670
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609492301
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609484594
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609524437
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609473898
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609468717
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609498511
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609543847
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609476862
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609532138
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609511533
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609529363
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609516236
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609536413
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609477042
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609545186
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609520152
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609462083
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609514011
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609534512
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609536004
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609512330
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609519644
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609537998
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609539783
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609501477
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609471561
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609501740
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609479948
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609527455
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609516759
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609533941
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609495403
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609478659
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609529436
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609515827
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609524919
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609543672
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609538657
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609542519
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609535970
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609462243
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609471152
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609477216
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609477872
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609486480
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609494502
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609505019
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609470143
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609468576
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609507770
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609530093
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609531496
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609542890
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609471309
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609499735
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609511228
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609489556
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609501735
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609503651
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609517208
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609475165
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609514824
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609468475
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609530503
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609516207
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609466947
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609468069
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609532331
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609507341
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609464308
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609486398
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609463325
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609508533
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609544169
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609480869
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609517078
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609517003
                    }
                ],
                "actuator": [
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609540401
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609528677
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609537006
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609495789
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609535758
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609495999
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609516209
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609514549
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609521700
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609464139
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609499192
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609520785
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609535007
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609519969
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609539971
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609511637
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609512942
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609485078
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609511366
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609491595
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609534384
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609523758
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609512911
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609492925
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609467887
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609506998
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609479174
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609468647
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609503845
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609484504
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609507381
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609512851
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609526794
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609462210
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609526238
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609533167
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609524209
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609475193
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609514580
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609534587
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609475838
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609464701
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609491250
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609500537
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609480516
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609524716
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609537920
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609538570
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609518561
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609494997
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609462520
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609486582
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609476868
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609537721
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609505615
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609508778
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609537016
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609536360
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609462628
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609539651
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609535613
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609537940
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609466524
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609534974
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609532066
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609535110
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609470403
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609465660
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609533969
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609512836
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609482024
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609538869
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609495024
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609511238
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609521464
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609480812
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609529230
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609480512
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609521856
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609513833
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609498724
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609507400
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609484063
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609496608
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609485078
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609511820
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609486689
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609524889
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609528643
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609532000
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609476734
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609545127
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609462101
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609519149
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609520352
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609462138
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609525736
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609526962
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609514580
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609502381
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609625278
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609563442
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609600683
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609589788
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609582119
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609575228
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609567918
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609577812
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609563822
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609559923
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609554066
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609619491
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609558292
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609631512
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609578573
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609611960
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609570309
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609548968
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609614978
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609606299
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609560245
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609617633
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609552048
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609561051
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609565515
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609551556
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609614493
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609552460
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609574329
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609597067
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609569794
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609551745
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609602868
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609564418
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609590441
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609584376
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609615655
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609603517
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609605838
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609604679
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609627471
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609554991
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609560682
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609591807
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609591206
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609550437
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609616745
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609577761
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609566554
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609618935
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609602485
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609580305
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609614502
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609560562
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609608264
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609591006
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609594040
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609603760
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609560611
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609550677
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609606356
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609575481
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609566367
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609620162
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609618623
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609548723
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609610520
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609561996
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609618405
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609614403
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609590759
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609598454
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609548716
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609613235
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609597699
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609549390
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609549697
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609572889
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609573141
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609584934
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609581144
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609591149
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609558520
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609583249
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609602368
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609627388
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609599566
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609574960
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609561518
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609556442
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609591231
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609564042
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609629649
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609552227
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609587920
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609618330
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609613563
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609613541
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609552764
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609577226
                    }
                ],
                "actuator": [
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609595649
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609551452
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609629955
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609604880
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609583658
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609550506
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609580302
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609630847
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609565887
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609608949
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609600463
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609620904
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609563458
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609619009
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609576635
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609547852
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609600152
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609602342
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609575262
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609605763
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609573221
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609550000
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609563748
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609553565
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609572518
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609574659
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609571651
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609605522
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609547575
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609596382
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609559013
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609607852
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609612533
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609575241
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609608201
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609552218
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609556875
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609562789
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609585269
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609600296
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609549579
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609585352
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609576086
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609624089
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609548603
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609554209
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609596218
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609589405
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609624634
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609551809
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609618538
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609592461
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609597006
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609599764
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609630910
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609579374
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609620896
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609579344
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609562581
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609572584
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609589227
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609561749
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609626401
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609572198
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609567817
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609615219
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609549920
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609596207
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609608760
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609590816
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609631673
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609585567
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609603066
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609589166
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609584473
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609604183
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609592723
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609592761
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609587852
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609594960
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609551099
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609561806
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609556429
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609622873
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609595386
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609618586
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609616480
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609617465
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609606181
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609591416
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609554623
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609626283
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609580699
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609621613
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609619808
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609604303
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609596221
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609621963
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609598147
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609567506
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609686917
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609643453
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609646974
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609647654
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609684641
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609657271
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609660886
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609663490
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609655856
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609637815
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609685708
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609681035
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609710921
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609636790
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609715337
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609695372
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609685708
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609676291
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609683773
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609710666
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609664772
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609670612
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609689084
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609653985
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609697881
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609717746
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609703750
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609653225
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609680225
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609695655
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609689469
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609634158
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609677546
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609636712
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609674913
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609688803
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609706529
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609660313
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609654043
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609692436
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609663578
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609714099
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609705227
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609635846
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609678563
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609651314
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609649088
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609635785
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609632623
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609637528
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609665879
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609710572
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609673930
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609664556
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609644337
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609646124
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609674429
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609647527
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609681737
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609657482
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609649807
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609689553
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609709516
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609683441
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609659210
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609710476
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609638288
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609655485
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609696275
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609637145
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609679135
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609667528
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609678217
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609708206
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609714604
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609680756
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609645069
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609655081
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609646724
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609638434
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609644731
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609661599
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609688968
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609637371
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609643163
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609684013
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609690562
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609708324
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609686446
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609635389
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609703717
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609705883
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609650759
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609701839
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609643947
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609659934
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609671294
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609678581
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609677351
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609679179
                    }
                ],
                "actuator": [
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609649413
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609636381
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609687820
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609656372
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609670389
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609679015
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609706894
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609632498
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609667492
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609655381
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609636834
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609711737
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609666900
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609681167
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609687970
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609683969
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609676513
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609686353
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609682828
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609655643
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609667185
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609661136
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609633809
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609712029
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609633097
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609692025
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609667663
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609666679
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609648277
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609662573
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609650288
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609680661
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609681189
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609676655
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609698806
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609686142
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609639642
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609707094
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609669507
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609691356
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609684580
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609686247
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609685253
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609641324
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609698509
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609699140
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609665435
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609639844
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609713194
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609706468
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609712945
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609660554
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609714827
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609709038
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609643024
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609705657
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609659943
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609673661
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609705102
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609657699
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609714496
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609646824
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609669075
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609682713
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609669712
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609707839
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609645474
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609681812
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609633709
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609645743
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609717822
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609675813
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609710800
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609673088
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609636154
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609683621
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609696508
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609676575
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609685164
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609698238
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609708909
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609687074
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609690237
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609674355
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609678927
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609646442
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609712800
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609653354
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609672268
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609710377
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609715945
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609699358
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609700114
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609665291
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609703464
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609676000
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609663558
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609670895
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609667976
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609666333
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609785076
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609778402
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609743912
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609780867
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609790656
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609719751
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609725443
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609776570
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609780909
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609757550
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609799610
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609750816
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609760735
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609743056
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609784684
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609779042
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609766456
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609718539
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609746465
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609784581
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609783041
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609803563
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609790037
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609766106
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609720219
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609753630
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609723376
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609784054
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609766096
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609719727
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609786951
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609775080
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609731288
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609731652
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609756926
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609767576
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609757602
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609783589
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609755453
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609789415
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609720749
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609780791
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609760259
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609761906
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609754342
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609736510
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609792823
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609763954
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609784860
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609787659
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609741848
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609726813
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609746761
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609777028
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609770665
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609784174
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609778780
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609721267
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609801473
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609789464
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609766240
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609727795
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609726582
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609754201
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609734684
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609767703
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609761975
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609759097
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609784924
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609726275
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609728143
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609736781
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609744811
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609740981
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609761455
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609745670
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609734221
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609743865
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609802772
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609762956
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609747442
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609799188
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609740792
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609742132
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609782611
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609726822
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609731026
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609788338
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609775320
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609755571
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609797039
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609752821
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609742887
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609750983
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609791579
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609726243
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609777985
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609733605
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609803697
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609725203
                    }
                ],
                "actuator": [
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609765035
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609745079
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609770630
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609796715
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609766607
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609730531
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609726907
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609726321
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609743801
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609754055
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609740053
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609730046
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609777238
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609739901
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609767543
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609722915
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609764096
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609798118
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609739069
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609795622
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609785656
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609719579
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609731859
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609793474
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609745111
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609750782
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609727796
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609722415
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609799831
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609733445
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609745749
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609789286
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609773784
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609731223
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609742443
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609733524
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609780416
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609770664
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609722619
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609747820
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609743867
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609720384
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609797876
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609783626
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609731633
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609757115
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609788564
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609790010
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609770054
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609777174
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609795621
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609773706
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609762953
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609749555
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609770869
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609794078
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609734376
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609728952
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609762332
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609779431
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609768465
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609795888
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609785144
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609759253
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609757047
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609755692
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609745923
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609766370
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609781385
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609734230
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609798091
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609736803
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609722433
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609766013
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609775950
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609779338
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609737910
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609731820
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609737549
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609741667
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609754238
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609726137
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609759781
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609774022
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609762037
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609738274
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609779449
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609799005
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609794992
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609768998
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609780277
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609744124
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609765627
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609748144
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609744858
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609780484
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609753423
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609719677
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609734863
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609769458
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609883439
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609852230
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609870801
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609878614
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609862395
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609861749
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609855355
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609857380
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609862223
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609870965
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609831284
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609806212
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609806475
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609858672
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609816569
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609840668
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609844910
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609874731
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609813986
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609832627
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609843151
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609818100
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609864591
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609839364
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609846903
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609833191
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609870335
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609883556
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609836436
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609830483
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609830484
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609814863
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609878970
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609828746
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609833284
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609827272
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609874846
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609890799
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609836803
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609814236
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609853294
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609851876
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609814585
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609883825
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609884775
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609817064
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609827320
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609809363
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609859887
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609831591
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609858569
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609809209
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609876636
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609827478
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609865061
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609879823
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609812571
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609823434
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609838625
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609876926
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609843969
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609890152
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609858450
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609811174
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609805102
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609858614
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609823920
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609842513
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609847827
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609863970
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609842979
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609826940
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609871900
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609814008
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609856187
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609842025
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609828731
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609870380
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609853034
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609838602
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609865595
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609842415
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609883753
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609882277
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609838812
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609864338
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609847133
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609811113
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609869905
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609819226
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609881813
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609825300
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609833828
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609856966
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609812158
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609826586
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609890539
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609889472
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609829841
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609874383
                    }
                ],
                "actuator": [
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609844164
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609860491
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609843104
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609819349
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609862567
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609882285
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609886059
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609867327
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609848156
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609811820
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609862559
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609876832
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609842196
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609838806
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609836210
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609876651
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609810591
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609884410
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609879911
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609847416
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609848196
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609888340
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609827730
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609872495
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609828016
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609883599
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609835215
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609891143
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609824918
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609859749
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609812164
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609832613
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609853402
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609890301
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609869022
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609814177
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609806289
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609834129
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609857288
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609876693
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609837074
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609886116
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609856031
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609872570
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609820157
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609826775
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609877953
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609805220
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609835066
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609810074
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609872265
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609817031
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609842209
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609856440
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609852342
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609808069
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609815668
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609862307
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609867953
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609832719
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609812761
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609813438
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609828120
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609837138
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609804901
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609834055
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609844654
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609884541
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609846198
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609870861
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609812742
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609875712
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609832465
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609819606
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609858844
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609838212
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609854428
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609852318
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609810197
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609825209
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609880300
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609827976
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609847777
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609862190
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609878252
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609846105
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609806890
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609867410
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609890961
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609846579
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609833943
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609848513
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609845233
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609811567
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609862543
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609856766
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609864053
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609854096
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609860667
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609837234
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609953509
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609909960
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609924695
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609969208
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609912076
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609973988
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609954606
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609918810
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609916800
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609970940
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609898162
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609929650
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609933404
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609964043
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609971816
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609922070
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609907951
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609910558
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609970904
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609893825
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609974513
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609949161
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609942964
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609974392
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609899992
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609944976
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609957430
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609897432
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609955365
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609970617
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609959921
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609947316
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609959531
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609927750
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609892671
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609906076
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609971460
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609892048
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609940858
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609897970
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609974905
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609956651
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609940663
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609932287
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609918393
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609905689
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609944742
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609921544
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609937610
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609908702
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609946364
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609896974
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609929674
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609902025
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609902320
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609975003
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609898099
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609898146
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609891972
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609919457
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609945416
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609903795
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609907110
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609893955
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609971170
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609939025
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609914921
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609936673
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609895043
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609924697
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609892777
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609964894
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609969316
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609899616
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609939883
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609910836
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609946164
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609910314
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609975048
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609902639
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609968477
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609923033
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609924372
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609923807
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609947259
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609924865
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609916410
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609905935
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609949905
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609947720
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609923714
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609946743
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609946198
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609961818
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1609934058
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609971383
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609950490
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609912457
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609927483
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609910169
                    }
                ],
                "actuator": [
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609904314
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609925378
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609925195
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609930910
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609965907
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609893198
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609920037
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609930128
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609901066
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609892778
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609970071
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609908132
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609953454
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609917341
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609958984
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609937385
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609965234
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609950789
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609933481
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609909271
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609967994
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609917984
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609972692
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609954547
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609958325
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609910101
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609895169
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609927703
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609960171
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609969150
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609965114
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609937573
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609914050
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609902300
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609929647
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609961286
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609959343
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609933746
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609948291
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609900451
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609916054
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609904230
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609951949
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609908446
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609934706
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609926852
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609944433
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609917016
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609929458
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609951894
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609949944
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609904225
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609914407
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609893127
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609914242
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609963059
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609924434
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609944709
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609966158
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609959080
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609973462
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609936827
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609934636
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609897721
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609957179
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609897952
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609908447
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609929253
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609921173
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609973718
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609935410
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609974001
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609972000
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609920967
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609919873
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609892377
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609937324
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609943752
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609961405
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609921664
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609892331
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609972862
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609927542
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609924873
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609947320
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609973746
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609918939
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609951914
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609958446
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609915127
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609909517
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609908144
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609952078
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609911330
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609952401
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609974752
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609976623
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609951551
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609959209
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609970727
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1609979101
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610063261
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610046405
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610056934
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609998377
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610026659
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609980105
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609999100
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610046457
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610014188
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610037112
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610047393
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610046450
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609988104
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609982975
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610046981
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610026447
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610004939
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610021435
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610028355
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610016215
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610020985
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609988990
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610063560
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610053208
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610054125
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610060133
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610050402
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609983117
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609979286
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609998026
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610013299
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610004126
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610025488
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610042736
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1609990011
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610034553
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610059200
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610036916
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610057115
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610015542
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609999101
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610059191
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610039015
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1609984021
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610025759
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610057983
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610006292
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610019452
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1609989138
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610017899
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609991380
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1609980455
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610049532
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610031224
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610056460
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610025147
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610056321
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1609981087
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610009669
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609993360
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610005985
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610038160
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1609986939
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610020280
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610025642
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610046024
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610042888
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1609993991
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610049182
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610022533
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610059624
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610053584
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610036574
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1609984733
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610033709
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609978622
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610037208
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610023133
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610003688
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1609986939
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610062531
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1609989236
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1609988068
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610026836
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610063556
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1609992096
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610038775
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610063738
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610039870
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610018150
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1609982999
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610058625
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610005819
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610049627
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1609998450
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610045602
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610040151
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610031786
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610006198
                    }
                ],
                "actuator": [
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610036516
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610045090
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610044649
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609995221
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610054973
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610008129
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609985767
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610038499
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610052321
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610021786
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609999152
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609994350
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610044340
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610002505
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610023953
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610052699
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610040140
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610063910
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610053610
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610029074
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610060114
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610054386
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610015842
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610063500
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609985989
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609979090
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610004677
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610024953
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610038471
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609999581
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610040296
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610043319
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609980742
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609988692
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609997093
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609989915
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610002047
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609993620
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610020686
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610054931
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610021589
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610012581
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610016693
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610047132
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610037025
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610053291
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610021367
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610050700
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610037777
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610050143
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610034476
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610036342
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610052655
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610061197
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610009487
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610018500
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610031089
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609993581
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610020616
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610033247
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610007662
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609989115
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610005757
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609998120
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610050411
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610053485
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609997116
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610058252
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609997496
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610019041
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609986462
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610059628
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610051164
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610008744
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610061631
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609977672
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610045238
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609984130
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610055895
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610034613
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610050033
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610031490
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610058354
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610049757
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610030561
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610035976
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610010948
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609997049
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610005045
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609977650
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610017936
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610012567
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610017398
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610023648
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610031730
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610045135
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610004482
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609991487
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1609995084
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610032057
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610089578
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610122374
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610069974
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610103331
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610102817
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610093739
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610080433
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610093547
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610147752
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610073754
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610138979
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610075047
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610130001
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610090360
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610091488
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610115942
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610134521
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610067680
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610113949
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610103920
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610148954
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610090337
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610120591
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610110063
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610102524
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610123554
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610085589
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610097724
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610075733
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610081558
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610134058
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610102915
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610072132
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610081142
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610092488
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610072420
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610124095
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610119513
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610123439
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610105618
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610110370
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610064551
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610075168
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610125618
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610125253
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610093701
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610104686
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610084995
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610114995
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610149826
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610132988
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610135253
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610129832
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610146103
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610076505
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610108447
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610086279
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610119160
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610080263
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610101484
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610149038
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610125990
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610105152
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610115529
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610130757
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610125911
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610132735
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610089798
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610103864
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610112559
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610117054
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610070099
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610128163
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610090932
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610080601
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610076727
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610064117
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610075676
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610069562
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610089223
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610111093
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610082339
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610139394
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610080487
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610143964
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610072617
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610097149
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610077228
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610076794
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610066910
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610091218
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610102248
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610086938
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610141117
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610112004
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610085542
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610150053
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610140397
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610114888
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610109578
                    }
                ],
                "actuator": [
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610073871
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610121464
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610064555
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610086373
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610106948
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610093561
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610098456
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610115873
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610076987
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610124936
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610146566
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610122018
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610084155
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610100838
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610081461
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610112529
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610149137
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610065484
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610078922
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610114046
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610087784
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610147055
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610066017
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610112928
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610126154
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610125278
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610133866
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610080315
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610116756
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610148772
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610077002
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610072633
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610068492
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610144715
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610118608
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610118608
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610073281
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610111721
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610064121
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610076963
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610089077
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610105918
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610071000
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610077040
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610149020
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610084808
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610110997
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610072339
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610127909
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610121274
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610079309
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610136216
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610086528
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610066444
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610101086
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610133649
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610092522
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610065351
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610109159
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610129596
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610122485
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610129630
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610137086
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610121981
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610121887
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610087224
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610115326
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610114950
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610124730
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610132263
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610110023
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610104994
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610134304
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610137156
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610089523
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610120065
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610081105
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610142230
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610086773
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610104587
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610081564
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610097724
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610120783
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610110798
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610080306
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610126312
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610093613
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610139187
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610066036
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610134913
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610065515
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610113940
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610106312
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610149750
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610134882
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610100677
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610128188
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610142622
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610149120
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610076144
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610167006
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610221783
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610202151
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610224645
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610214065
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610167310
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610234967
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610172032
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610227506
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610191101
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610185033
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610183511
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610233721
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610212179
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610192725
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610235141
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610193297
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610151878
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610197279
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610188812
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610172762
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610176985
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610167229
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610197695
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610190313
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610202657
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610171033
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610227160
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610216769
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610186510
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610203264
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610151893
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610159743
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610204693
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610178044
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610202015
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610233572
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610201391
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610236641
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610157190
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610175810
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610221223
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610215912
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610234035
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610178372
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610219413
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610216230
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610200338
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610232861
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610188810
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610154385
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610177542
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610176264
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610194309
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610220796
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610221822
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610226838
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610235486
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610216214
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610181597
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610210751
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610158118
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610202583
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610183717
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610186668
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610222739
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610182281
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610191700
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610197741
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610228646
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610165087
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610190053
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610170546
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610194443
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610159473
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610158914
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610199196
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610232545
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610158036
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610175039
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610179649
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610150600
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610219207
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610230410
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610214893
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610205619
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610165673
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610232524
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610199961
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610177746
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610161207
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610150976
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610159198
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610192142
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610163826
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610183178
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610190993
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610211066
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610198302
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610184272
                    }
                ],
                "actuator": [
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610227944
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610219555
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610180078
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610177769
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610196583
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610152855
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610173644
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610207256
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610203119
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610233524
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610205519
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610189638
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610177019
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610234272
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610218320
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610203463
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610154237
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610227793
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610231220
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610159343
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610160960
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610216250
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610169689
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610202423
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610235120
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610206027
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610155679
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610159279
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610150592
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610233910
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610173444
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610176827
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610205499
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610160526
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610178730
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610153322
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610205385
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610191264
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610207300
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610203470
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610213296
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610193802
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610223064
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610198554
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610192867
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610176193
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610228339
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610211203
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610194205
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610189910
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610222339
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610210447
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610227258
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610214193
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610160407
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610161681
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610235836
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610175119
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610189320
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610198450
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610193287
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610186116
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610227862
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610217559
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610233117
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610192108
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610185217
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610159734
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610211907
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610203315
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610216206
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610178025
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610232441
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610223369
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610206008
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610210427
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610206814
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610160949
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610225813
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610192931
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610153505
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610169682
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610185837
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610190323
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610208403
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610231730
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610182777
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610173031
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610181923
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610164538
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610179210
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610151016
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610209735
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610185620
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610168682
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610172229
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610167667
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610235371
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610204170
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610226692
                    }
                ]
            },
            {
                "sensor": [
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610299571
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610301600
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610323142
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610266788
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610320353
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610304196
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610296876
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610272777
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610282922
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610307896
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610267010
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610285447
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610248306
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610300847
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610320659
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610242444
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610294614
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610249230
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610273949
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610288732
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610312415
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610255867
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610257974
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610288869
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610256507
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610280550
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610255366
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610266461
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610297923
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610237977
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610284623
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610284972
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610266273
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610292247
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610247385
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610294153
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610242007
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610261705
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610303023
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610312028
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610315663
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610272458
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610319345
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610259929
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610301004
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610294721
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610275304
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610259662
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610317035
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610242038
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610317369
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610261283
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610240071
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610275168
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610311836
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610298029
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610278846
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610279605
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor1\" is working properly",
                        "timeStamp": 1610310903
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610250617
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor3\" is working properly",
                        "timeStamp": 1610241642
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610278273
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610309787
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610299360
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610247398
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor1\" is working properly",
                        "timeStamp": 1610250128
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610260308
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610254649
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610252713
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610268357
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610322561
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610291556
                    },
                    {
                        "logContent": "Sensor \"CO2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610284412
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor2\" is working properly",
                        "timeStamp": 1610305354
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610251816
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610317506
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610266178
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610263048
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor2\" is working properly",
                        "timeStamp": 1610277485
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor1\" is working properly",
                        "timeStamp": 1610288901
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610262455
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610264923
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610282277
                    },
                    {
                        "logContent": "Sensor \"TempActive1Sensor2\" is working properly",
                        "timeStamp": 1610247883
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610294857
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor2\" is working properly",
                        "timeStamp": 1610252689
                    },
                    {
                        "logContent": "Sensor \"CH4ExhaustSensor1\" is working properly",
                        "timeStamp": 1610300941
                    },
                    {
                        "logContent": "Sensor \"MoistActive1Sensor2\" is working properly",
                        "timeStamp": 1610297037
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610276095
                    },
                    {
                        "logContent": "Sensor \"TempCuringSensor4\" is working properly",
                        "timeStamp": 1610247592
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610256680
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610262523
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610250684
                    },
                    {
                        "logContent": "Sensor \"O2ExhaustSensor1\" is working properly",
                        "timeStamp": 1610258686
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor1\" is working properly",
                        "timeStamp": 1610261036
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610281334
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610290864
                    },
                    {
                        "logContent": "Sensor \"MoistCuringSensor1\" is working properly",
                        "timeStamp": 1610242395
                    },
                    {
                        "logContent": "Sensor \"MoistActive2Sensor1\" is working properly",
                        "timeStamp": 1610237249
                    },
                    {
                        "logContent": "Sensor \"TempActive2Sensor2\" is working properly",
                        "timeStamp": 1610275290
                    }
                ],
                "actuator": [
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610318158
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610318713
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610304775
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610317738
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610249866
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610305191
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610298036
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610278931
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610263084
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610263441
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610322565
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610318151
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610240585
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610319487
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610293455
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610239397
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610298075
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610241665
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610293149
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610282509
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610322493
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610309172
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610246051
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610285311
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610265627
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610248254
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610256998
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610269309
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610265929
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610302454
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610285532
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610278802
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610273299
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610321141
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610287023
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610322232
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610290893
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610252333
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610243613
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610248449
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610253718
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610248920
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610323042
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610313668
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610284606
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610242481
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610248435
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610267030
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610248066
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610294676
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610320534
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610306247
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610302169
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610294625
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610249560
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610247075
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610300839
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610246052
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610266429
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610244156
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610287405
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610305507
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610262691
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610260735
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610301006
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610270952
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610255928
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610238274
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610272580
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610270891
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610250116
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610292020
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610238700
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610286305
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610254670
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610318499
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610271646
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610265019
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610294983
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610318490
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610303993
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610300787
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610256721
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610245811
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610320931
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610276250
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610306773
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610262572
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610260832
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610290356
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610272142
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610321868
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610305095
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610265347
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610281479
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610276312
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610238645
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610243485
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610309117
                    },
                    {
                        "logContent": "Actuator \"actuator.name\" is working properly",
                        "timeStamp": 1610300077
                    }
                ]
            }
        ]
    }
});
define("src/utility/testSetup", ["require", "exports", "src/apiSetup", "src/constants", "src/controller/queryFacade", "timers/promises", "src/controller/v1/services/firebaseFreetier/firebaseService", "src/utility/encryption"], function (require, exports, apiSetup_2, constants_53, queryFacade_1, promises_1, firebaseService_12, encryption_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    apiSetup_2 = __importDefault(apiSetup_2);
    queryFacade_1 = __importDefault(queryFacade_1);
    class TestSetup {
        constructor() {
            this.closeHandler = null;
            this.prevEnv = process.env.NODE_ENV;
            this.user = null;
        }
        init() {
            return __awaiter(this, void 0, void 0, function* () {
                const { email, password } = constants_53.TEST_ACCOUNT;
                this.prevEnv = process.env.NODE_ENV;
                process.env.NODE_ENV = 'test';
                this.closeHandler = (0, apiSetup_2.default)(null);
                yield queryFacade_1.default.security.register(email, password).then(() => __awaiter(this, void 0, void 0, function* () { return yield (0, promises_1.setTimeout)(2000); }), () => { });
                this.user = yield queryFacade_1.default.security.login(email, password).catch(() => null);
            });
        }
        getAccessToken() {
            var _a, _b;
            let count = 0;
            while (count++ < 10) {
                if (!this.user)
                    (0, promises_1.setTimeout)(250).then(() => { });
            }
            return (_b = (_a = this.user) === null || _a === void 0 ? void 0 : _a.accessToken) !== null && _b !== void 0 ? _b : "";
        }
        tearDown() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                process.env.NODE_ENV = this.prevEnv;
                const [uid, apiKey] = (0, encryption_3.asymmetricKeyDecryption)(Buffer.from(this.getAccessToken(), "hex")).split("|");
                yield firebaseService_12.persistentFirebaseConnection.authService.deleteUser(uid, apiKey);
                yield new Promise(resolve => global.setTimeout(() => resolve(""), 500));
                (_a = this.closeHandler) === null || _a === void 0 ? void 0 : _a.call(null);
            });
        }
    }
    exports.default = TestSetup;
    TestSetup.TIME_OUT = 5000;
});
define("src/controller/__tests__/actuator.test", ["require", "exports", "src/controller/queryFacade", "src/controller/__tests__/testcases", "src/utility/testSetup"], function (require, exports, queryFacade_2, testcases_json_1, testSetup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    queryFacade_2 = __importDefault(queryFacade_2);
    testcases_json_1 = __importDefault(testcases_json_1);
    testSetup_1 = __importDefault(testSetup_1);
    describe("Test actuator actions - Integration test", () => {
        const setup = new testSetup_1.default();
        const timeOut = testSetup_1.default.TIME_OUT;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            setup.init();
        }), timeOut * (Math.max(testcases_json_1.default.actuatorConfigs.length, testcases_json_1.default.actuators.length) + 5));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setup.tearDown();
        }), timeOut * 5);
        const actuatorRead = queryFacade_2.default.actuator;
        test("should read all actuators from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = (yield actuatorRead.getActuators(setup.getAccessToken())).map(a => a.toJson());
            expect(testcases_json_1.default.actuators).toStrictEqual(result);
        }), timeOut);
        test("should read actuators by type from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const type = "Air pump";
            const result = yield actuatorRead.getCategorizedActuators(setup.getAccessToken(), type);
            if (!result || !Array.isArray(result))
                throw new Error("Wrong type");
            let index = 0;
            testcases_json_1.default.actuators.map(actuator => {
                if (actuator.type != type)
                    return;
                expect(result[index++].toJson()).toStrictEqual(actuator);
            });
        }), timeOut);
        test("should read actuator by name from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const randomIndex = Math.round(Math.random() * (testcases_json_1.default.actuators.length - 1));
            const name = testcases_json_1.default.actuators[randomIndex].name;
            const result = yield actuatorRead.getCategorizedActuators(setup.getAccessToken(), name);
            if (result.length != 1)
                throw new Error("Wrong type");
            expect(result[0].toJson()).toStrictEqual(testcases_json_1.default.actuators[randomIndex]);
        }), timeOut);
        const on2_check = (list, other_list) => list.map(dto => {
            const temp = other_list.find(val => val.actuatorName === dto.actuatorName);
            if (!temp || temp.timeStamp !== dto.timeStamp)
                return false;
            if (temp.toggleConfig) {
                expect(temp.toggleConfig).toStrictEqual(dto.toggleConfig);
                return true;
            }
            if (temp.motorConfig && temp.timesPerDay) {
                expect(temp.motorConfig).toStrictEqual(dto.motorConfig);
                expect(temp.timesPerDay).toBe(dto.timesPerDay);
                return true;
            }
            return false;
        }).filter(x => x).length === list.length;
        test("should get actuator configurations from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield actuatorRead.getActuatorConfigs(setup.getAccessToken());
            expect(on2_check(result, testcases_json_1.default.actuatorConfigs)).toBe(true);
        }), timeOut);
        test("should get actuator configurations from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield actuatorRead.getProposedActuatorConfigs(setup.getAccessToken());
            expect(on2_check(result, testcases_json_1.default.actuatorConfigs)).toBe(true);
        }), timeOut);
    });
});
define("src/utility/binarySearch", ["require", "exports", "src/model/patterns/option"], function (require, exports, option_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const defaultCompareFcn = function fcn(a, b) { return a == b ? 0 : (a > b ? 1 : -1); };
    function binarySearch(arr, target, opts) {
        const cmp = (opts === null || opts === void 0 ? void 0 : opts.compareFcn) || defaultCompareFcn;
        let [startIndex, endIndex, mid] = [
            (opts === null || opts === void 0 ? void 0 : opts.startIndex) || 0,
            (opts === null || opts === void 0 ? void 0 : opts.endIndex) || arr.length - 1,
            0
        ];
        while (endIndex > startIndex) {
            mid = startIndex + Math.floor((endIndex - startIndex) / 2);
            if (cmp(arr[mid], target) === 0)
                return (0, option_11.Some)({
                    foundIndex: mid
                });
            if (cmp(arr[mid], target) < 0) {
                startIndex = mid + 1;
                continue;
            }
            endIndex = mid;
        }
        return option_11.None;
    }
    exports.default = binarySearch;
});
define("src/controller/__tests__/dataSaving.test", ["require", "exports", "src/utility/testSetup", "src/controller/__tests__/testcases"], function (require, exports, testSetup_2, testcases_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    testSetup_2 = __importDefault(testSetup_2);
    testcases_json_2 = __importDefault(testcases_json_2);
    xdescribe("Data saving test - Integration test", () => {
        const setup = new testSetup_2.default();
        const timeOut = testSetup_2.default.TIME_OUT;
        const templateStartDate = 1609459200;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setup.init();
        }), timeOut * (testcases_json_2.default.dataSaving.sensor.length + testcases_json_2.default.dataSaving.logs.length + 5));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setup.tearDown();
        }), timeOut * 5);
        test("", () => { });
    });
});
define("src/controller/__tests__/firebaseService.test", ["require", "exports", "timers/promises", "src/constants", "src/utility/encryption", "src/controller/v1/services/firebaseFreetier/firebaseService"], function (require, exports, promises_2, constants_54, encryption_4, firebaseService_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("Test firebase service as a whole", () => {
        const service = firebaseService_13.persistentFirebaseConnection;
        const TIMEOUT = 1000 * 10;
        test("Test firebase storage service", () => __awaiter(void 0, void 0, void 0, function* () {
            const storage = service === null || service === void 0 ? void 0 : service.storageService;
            if (!storage)
                return;
            const testFile = "text1.txt";
            yield storage.uploadBytesToStorage("Hello", testFile).catch(reason => expect(reason).toBe(undefined));
            yield storage.readFileFromStorage(testFile)
                .then(result => {
                expect(result).not.toBe(undefined);
                expect(result.length).not.toBe(0);
            })
                .catch(reason => expect(reason).toBe(undefined));
            yield storage.deleteFileFromStorage(testFile).catch(reason => expect(reason).toBe(null));
            yield storage.readFileFromStorage(testFile)
                .then(result => {
                expect(result).toBe(undefined);
            })
                .catch(reason => expect(reason).not.toBe(null));
        }), TIMEOUT);
        describe("Test firebase firestore database", () => {
            const documentPath = "test/test1";
            const firestore = service.firestoreService;
            test("Should create a document in the database", () => __awaiter(void 0, void 0, void 0, function* () {
                yield firestore.createDocument(documentPath, { "value": "Hello" });
                const document = yield firestore.getDocument(documentPath);
                expect(document).not.toBe(undefined);
                expect(document.get("value")).toBe("Hello");
            }), TIMEOUT);
            test("Should update the document in the database", () => __awaiter(void 0, void 0, void 0, function* () {
                yield firestore.updateDocument(documentPath, { "val": "1" });
                const document = yield firestore.getDocument(documentPath);
                expect(document).not.toBe(undefined);
                expect(document.get("value")).toBe("Hello");
                expect(document.get("val")).toBe(undefined);
            }), TIMEOUT);
            test("Should set the document in the database", () => __awaiter(void 0, void 0, void 0, function* () {
                yield firestore.setDocument(documentPath, { "j": "k" });
                const document = yield firestore.getDocument(documentPath);
                expect(document).not.toBe(undefined);
                expect(document.get("j")).toBe("k");
                expect(document.get("value")).not.toBe("Hello");
                expect(document.get("idle")).not.toBe("true");
            }), TIMEOUT);
            test("Should delete the document in the database", () => __awaiter(void 0, void 0, void 0, function* () {
                yield firestore.deleteDocument(documentPath);
                expect((yield firestore.getDocument(documentPath)).data()).toBe(undefined);
            }), TIMEOUT);
        });
        describe("Test firebase realtime database", () => {
            const path = "test";
            const realTime = service.realtimeService;
            test("Should set new content to the database", () => __awaiter(void 0, void 0, void 0, function* () {
                yield realTime.setContent({ "test": "Hello" }, path);
                const contentSet = yield realTime.getContent(path);
                expect(contentSet.exists()).toBe(true);
                expect(contentSet.hasChild("test")).toBe(true);
                expect(contentSet.numChildren()).toBe(1);
                expect(typeof (contentSet.val())).toBe("object");
                expect(contentSet.val()['test']).toBe("Hello");
            }), TIMEOUT);
            test("Should push new content to the database", () => __awaiter(void 0, void 0, void 0, function* () {
                const key = yield realTime.pushContent({ "test1": "Test123" }, path).then(ref => ref.key);
                const contentPush = yield realTime.getContent(path, ref => ref.child(key).get());
                expect(contentPush.exists()).toBe(true);
                expect(contentPush.hasChild("test1")).toBe(true);
                expect(contentPush.numChildren()).toBe(1);
                expect(typeof (contentPush.val())).toBe("object");
                expect(contentPush.val()['test1']).toBe("Test123");
            }), TIMEOUT);
            test("Should update new content to the database", () => __awaiter(void 0, void 0, void 0, function* () {
                yield realTime.updateContent({ "test": "GoodBye" }, path);
                const contentUpdate = yield realTime.getContent(path);
                expect(contentUpdate.exists()).toBe(true);
                expect(contentUpdate.hasChild("test")).toBe(true);
                expect(typeof (contentUpdate.val())).toBe("object");
                expect(contentUpdate.val()['test']).toBe("GoodBye");
            }), TIMEOUT);
            test("Should delete content from the database", () => __awaiter(void 0, void 0, void 0, function* () {
                yield realTime.deleteContent(`${path}/test`);
                const contentDelete = yield realTime.getContent(path);
                expect(contentDelete.exists()).toBe(true);
                expect(contentDelete.hasChild("test")).not.toBe(true);
                expect(typeof (contentDelete.val())).toBe("object");
                expect(contentDelete.val()['test']).not.toBe("Hello");
            }), TIMEOUT);
        });
        test("Test firebase authentication", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = service === null || service === void 0 ? void 0 : service.authService;
            if (!auth)
                return;
            const { email, password } = constants_54.TEST_ACCOUNT;
            yield auth.registerWithEmail(email, password).catch(() => __awaiter(void 0, void 0, void 0, function* () {
                console.log("Failed to register");
            }));
            yield (0, promises_2.setTimeout)(TIMEOUT);
            let user = yield auth.loginWithEmail(email, password).catch(() => null);
            expect(user).not.toBe(null);
            expect(user.email).toBe(email);
            const [uid, apiKey] = (0, encryption_4.asymmetricKeyDecryption)(Buffer.from(user.accessToken, 'hex')).split("|");
            expect(yield auth.verifyApiKey(uid, apiKey)).toBe(true);
            user = yield auth.reauthenticationWithEmail(email, password);
            const [_, newApiKey] = (0, encryption_4.asymmetricKeyDecryption)(Buffer.from(user.accessToken, 'hex')).split("|");
            expect(newApiKey).not.toBe(apiKey);
            yield auth.deleteUser(uid, newApiKey);
            auth.logout(user);
            expect(user.isLoggedOut).toBe(true);
        }), TIMEOUT * 3);
    });
});
define("src/utility/intersection", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.intersectArrays = void 0;
    function intersectArrays(...arrays) {
        let hashMap1 = new Set();
        let hashMap2 = new Set();
        arrays[0].map(val => hashMap1.add(val));
        arrays.map((arr, index) => {
            if (index == 0 || !hashMap1.size)
                return;
            arr.map(val => {
                if (hashMap1.has(val))
                    hashMap2.add(val);
            });
            hashMap1 = hashMap2;
            hashMap2 = new Set();
        });
        return Array.from(hashMap1);
    }
    exports.intersectArrays = intersectArrays;
});
define("src/controller/__tests__/sensor.test", ["require", "exports", "src/controller/queryFacade", "src/controller/__tests__/testcases", "src/utility/testSetup", "src/utility/intersection"], function (require, exports, queryFacade_3, testcases_json_3, testSetup_3, intersection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    queryFacade_3 = __importDefault(queryFacade_3);
    testcases_json_3 = __importDefault(testcases_json_3);
    testSetup_3 = __importDefault(testSetup_3);
    describe("Test sensor actions - Integration test", () => {
        const setup = new testSetup_3.default();
        const timeOut = testSetup_3.default.TIME_OUT;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setup.init();
        }), timeOut * Math.max(testcases_json_3.default.sensorData.length, testcases_json_3.default.sensors.length + 5));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setup.tearDown();
        }), timeOut * (testcases_json_3.default.sensorData.length + testcases_json_3.default.sensors.length + 10) / 2);
        const sensorRead = queryFacade_3.default.sensor;
        test("should read all sensors from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield sensorRead.getSensors(setup.getAccessToken());
            testcases_json_3.default.sensors.map((sensor, index) => {
                expect(result[index].toJson()).toStrictEqual(sensor);
            });
        }), timeOut);
        test("should read sensors by type from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const type = "Temperature";
            const result = yield sensorRead.getCategorizedSensors(setup.getAccessToken(), type);
            if (!Array.isArray(result))
                throw new Error("Wrong type");
            let index = 0;
            testcases_json_3.default.sensors.map(sensor => {
                if (sensor.type != type)
                    return;
                expect(result[index++].toJson()).toStrictEqual(sensor);
            });
        }), timeOut);
        test("should read sensor by name from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const randomIndex = Math.round(Math.random() * (testcases_json_3.default.sensors.length - 1));
            const name = testcases_json_3.default.sensors[randomIndex].name;
            const result = yield sensorRead.getCategorizedSensors(setup.getAccessToken(), name);
            if (result.length != 1)
                throw new Error("Wrong type");
            expect(result[0].toJson()).toStrictEqual(testcases_json_3.default.sensors[randomIndex]);
        }), timeOut);
        test("should get sensor data from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield sensorRead.getSensorData(setup.getAccessToken(), 1661126400 - 3600 * 24, 1661126400);
            const intersection = (0, intersection_1.intersectArrays)(testcases_json_3.default.sensorData.map(({ sensorName, value, timeStamp }) => `${sensorName};${value};${timeStamp}`), result.map(dto => `${dto.sensorName};${dto.value};${dto.timeStamp}`));
            expect(intersection).not.toBe(0);
            expect(intersection.length).toBe(result.length);
        }), timeOut);
        test("should get sensor data by name from the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const name = "Temperature 9";
            const result = yield sensorRead.getSensorDataByName(setup.getAccessToken(), name);
            let index = 0;
            testcases_json_3.default.sensorData.map(data => {
                if (data.sensorName != name)
                    return;
                expect(result[index++].toJson()).toStrictEqual(data);
            });
        }), timeOut);
    });
});
define("src/controller/__tests__/systemCommand.test", ["require", "exports", "src/controller/commandFacade", "src/utility/testSetup", "src/controller/queryFacade"], function (require, exports, commandFacade_2, testSetup_4, queryFacade_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    commandFacade_2 = __importDefault(commandFacade_2);
    testSetup_4 = __importDefault(testSetup_4);
    queryFacade_4 = __importDefault(queryFacade_4);
    describe("Test system command as a whole", () => {
        const setup = new testSetup_4.default();
        const timeOut = testSetup_4.default.TIME_OUT;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setup.init();
        }), timeOut * 5);
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setup.tearDown();
        }), timeOut * 5);
        test("Should start the system", () => __awaiter(void 0, void 0, void 0, function* () {
            yield commandFacade_2.default.systemCommand.startSystem(setup.getAccessToken());
            const commands = yield queryFacade_4.default.systemCommand.getProposedSystemCommands(setup.getAccessToken());
            expect(commands.isStart).toBe(true);
            expect(commands.isStop).toBe(false);
            expect(commands.isPause).toBe(false);
            expect(commands.isRestart).toBe(false);
        }), timeOut);
        test("Should stop the system", () => __awaiter(void 0, void 0, void 0, function* () {
            yield commandFacade_2.default.systemCommand.stopSystem(setup.getAccessToken());
            const commands = yield queryFacade_4.default.systemCommand.getProposedSystemCommands(setup.getAccessToken());
            expect(commands.isStart).toBe(false);
            expect(commands.isStop).toBe(true);
            expect(commands.isPause).toBe(false);
            expect(commands.isRestart).toBe(false);
        }), timeOut);
        test("Should pause the system", () => __awaiter(void 0, void 0, void 0, function* () {
            yield commandFacade_2.default.systemCommand.pauseSystem(setup.getAccessToken());
            const commands = yield queryFacade_4.default.systemCommand.getProposedSystemCommands(setup.getAccessToken());
            expect(commands.isStart).toBe(false);
            expect(commands.isStop).toBe(false);
            expect(commands.isPause).toBe(true);
            expect(commands.isRestart).toBe(false);
        }), timeOut);
        test("Should restart the system", () => __awaiter(void 0, void 0, void 0, function* () {
            yield commandFacade_2.default.systemCommand.restartSystem(setup.getAccessToken());
            const commands = yield queryFacade_4.default.systemCommand.getProposedSystemCommands(setup.getAccessToken());
            expect(commands.isStart).toBe(false);
            expect(commands.isStop).toBe(false);
            expect(commands.isPause).toBe(false);
            expect(commands.isRestart).toBe(true);
        }), timeOut);
    });
});
define("src/controller/__tests__/systemLog.test", ["require", "exports", "src/controller/queryFacade", "src/constants", "src/controller/__tests__/testcases", "src/utility/testSetup"], function (require, exports, queryFacade_5, constants_55, testcases_json_4, testSetup_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    queryFacade_5 = __importDefault(queryFacade_5);
    testcases_json_4 = __importDefault(testcases_json_4);
    testSetup_5 = __importDefault(testSetup_5);
    describe("Test sensor actions - Integration test", () => {
        const setup = new testSetup_5.default();
        const timeOut = testSetup_5.default.TIME_OUT;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setup.init();
        }), timeOut * (Math.max(testcases_json_4.default.sensorLogs.length, testcases_json_4.default.actuatorLogs.length) + 5));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setup.tearDown();
        }), timeOut * 5);
        const logsRead = queryFacade_5.default.logs;
        test("should read all sensor logs form the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield logsRead.getSensorLogs(setup.getAccessToken());
            expect(result.length).toBeGreaterThan(0);
            expect(result.length).toBeLessThanOrEqual(constants_55.LOG_LINES);
        }), timeOut);
        test("should read all actuator logs form the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield logsRead.getActuatorLogs(setup.getAccessToken());
            expect(result.length).toBeGreaterThan(0);
            expect(result.length).toBeLessThanOrEqual(constants_55.LOG_LINES);
        }), timeOut);
    });
});
define("src/controller/database/client", ["require", "exports", "pg", "src/constants"], function (require, exports, pg_1, constants_56) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.clientWrapper = exports.transactionWrapper = void 0;
    function transactionWrapper(callback, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_56.logger.info("Created a PostgreSQL transaction wrapper");
            return clientWrapper((pool) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield pool.query("BEGIN");
                    const result = yield callback(pool, ...params);
                    yield pool.query("COMMIT");
                    return result;
                }
                catch (e) {
                    yield pool.query("ROLLBACK");
                    constants_56.logger.error(`An error occurred when making a data transaction: ${e.message}.\nStack trace: ${e.trace}`);
                    return null;
                }
                finally {
                    constants_56.logger.info("Finished PostgreSQL transaction wrapper");
                }
            }), ...params);
        });
    }
    exports.transactionWrapper = transactionWrapper;
    function clientWrapper(callback, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_56.logger.info("Created a PostgreSQL client wrapper");
            let pool;
            try {
                pool = yield new pg_1.Pool({
                    connectionString: constants_56.dbConnection.databaseUrl,
                    ssl: constants_56.dbConnection.ssl
                }).connect();
                let result = yield callback(pool, ...params);
                return result;
            }
            catch (e) {
                constants_56.logger.error(`An error occurred when making a data request: ${e.message}. Stack trace: ${e.trace}`);
            }
            finally {
                pool === null || pool === void 0 ? void 0 : pool.release();
                constants_56.logger.info("Finished PostgreSQL client wrapper");
            }
        });
    }
    exports.clientWrapper = clientWrapper;
});
define("src/controller/database/setup", ["require", "exports", "fs/promises", "path", "src/constants", "src/controller/database/client"], function (require, exports, promises_3, path_1, constants_57, client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setupPostgreSQL = exports.dropSchema = exports.dropAllTables = void 0;
    path_1 = __importDefault(path_1);
    function dropAllTables(isTest = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, client_1.transactionWrapper)((pool) => __awaiter(this, void 0, void 0, function* () {
                yield pool.query(yield (0, promises_3.readFile)(path_1.default.join(__dirname, isTest ? "/sql/dropTestTables.sql" : "/sql/dropTables.sql"), { encoding: "utf8" }));
            }));
        });
    }
    exports.dropAllTables = dropAllTables;
    function dropSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, client_1.transactionWrapper)((pool) => __awaiter(this, void 0, void 0, function* () {
                yield pool.query(`DROP SCHEMA ${constants_57.schemaName} CASCADE;`);
            }));
        });
    }
    exports.dropSchema = dropSchema;
    function setupPostgreSQL(isTest = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, client_1.clientWrapper)((pool) => __awaiter(this, void 0, void 0, function* () {
                const tableCreationQuery = yield (0, promises_3.readFile)(path_1.default.join(__dirname, isTest ? "/sql/createTestTables.sql" : "/sql/createTables.sql"), { encoding: "utf8" });
                for (const creationQuery of tableCreationQuery.split("\r\n\r\n")) {
                    try {
                        constants_57.logger.info(creationQuery);
                        yield pool.query(creationQuery)
                            .then(val => constants_57.logger.info(val), err => constants_57.logger.error(err));
                    }
                    catch (e) {
                        constants_57.logger.error(e);
                    }
                }
            }));
        });
    }
    exports.setupPostgreSQL = setupPostgreSQL;
});
define("src/controller/database/postgres/client", ["require", "exports", "pg", "src/constants"], function (require, exports, pg_2, constants_58) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.clientWrapper = exports.transactionWrapper = void 0;
    function transactionWrapper(callback, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_58.logger.info("Created a PostgreSQL transaction wrapper");
            return clientWrapper((pool) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield pool.query("BEGIN");
                    const result = yield callback(pool, ...params);
                    yield pool.query("COMMIT");
                    return result;
                }
                catch (e) {
                    yield pool.query("ROLLBACK");
                    constants_58.logger.error(`An error occurred when making a data transaction: ${e.message}.\nStack trace: ${e.trace}`);
                    return null;
                }
                finally {
                    constants_58.logger.info("Finished PostgreSQL transaction wrapper");
                }
            }), ...params);
        });
    }
    exports.transactionWrapper = transactionWrapper;
    function clientWrapper(callback, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_58.logger.info("Created a PostgreSQL client wrapper");
            let pool;
            try {
                pool = yield new pg_2.Pool({
                    connectionString: constants_58.dbConnection.databaseUrl,
                    ssl: constants_58.dbConnection.ssl
                }).connect();
                let result = yield callback(pool, ...params);
                return result;
            }
            catch (e) {
                constants_58.logger.error(`An error occurred when making a data request: ${e.message}. Stack trace: ${e.trace}`);
            }
            finally {
                pool === null || pool === void 0 ? void 0 : pool.release();
                constants_58.logger.info("Finished PostgreSQL client wrapper");
            }
        });
    }
    exports.clientWrapper = clientWrapper;
});
define("src/controller/database/postgres/setup", ["require", "exports", "fs/promises", "path", "src/constants", "src/controller/database/postgres/client"], function (require, exports, promises_4, path_2, constants_59, client_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setupPostgreSQL = exports.dropSchema = exports.dropAllTables = void 0;
    path_2 = __importDefault(path_2);
    function dropAllTables(isTest = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, client_2.transactionWrapper)((pool) => __awaiter(this, void 0, void 0, function* () {
                yield pool.query(yield (0, promises_4.readFile)(path_2.default.join(__dirname, isTest ? "/sql/dropTestTables.sql" : "/sql/dropTables.sql"), { encoding: "utf8" }));
            }));
        });
    }
    exports.dropAllTables = dropAllTables;
    function dropSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, client_2.transactionWrapper)((pool) => __awaiter(this, void 0, void 0, function* () {
                yield pool.query(`DROP SCHEMA ${constants_59.schemaName} CASCADE;`);
            }));
        });
    }
    exports.dropSchema = dropSchema;
    function setupPostgreSQL(isTest = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, client_2.clientWrapper)((pool) => __awaiter(this, void 0, void 0, function* () {
                const tableCreationQuery = yield (0, promises_4.readFile)(path_2.default.join(__dirname, isTest ? "/sql/createTestTables.sql" : "/sql/createTables.sql"), { encoding: "utf8" });
                for (const creationQuery of tableCreationQuery.split("\r\n\r\n")) {
                    try {
                        constants_59.logger.info(creationQuery);
                        yield pool.query(creationQuery)
                            .then(val => constants_59.logger.info(val), err => constants_59.logger.error(err));
                    }
                    catch (e) {
                        constants_59.logger.error(e);
                    }
                }
            }));
        });
    }
    exports.setupPostgreSQL = setupPostgreSQL;
});
define("src/model/patterns/result", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Err = exports.Ok = void 0;
    class Success {
        constructor(val) {
            this.val = val;
        }
        handleResult(ok, _) {
            ok && ok(this.val);
        }
        handleResultAsync(ok, _) {
            return __awaiter(this, void 0, void 0, function* () {
                ok && (yield ok(this.val));
            });
        }
    }
    class Failure {
        constructor(error) {
            this.err = error;
        }
        handleResult(_, error) {
            error && error(this.err);
        }
        handleResultAsync(_, error) {
            return __awaiter(this, void 0, void 0, function* () {
                error && (yield error(this.err));
            });
        }
    }
    function Ok(val) { return new Success(val); }
    exports.Ok = Ok;
    function Err(err) { return new Failure(err); }
    exports.Err = Err;
});
define("src/model/patterns/serializable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/utility/byteArray", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.byteArrayToString = exports.stringToByteArray = void 0;
    function stringToByteArray(str) {
        const byteArray = new Array();
        for (let i = 0; i < str.length; i++)
            byteArray.push(str.charCodeAt(i));
        return new Uint8Array(byteArray);
    }
    exports.stringToByteArray = stringToByteArray;
    function byteArrayToString(byteArray, encoding) {
        return Buffer.from(byteArray).toString(encoding || "utf-8");
    }
    exports.byteArrayToString = byteArrayToString;
});
define("src/utility/setCookie", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setSignedCookie = exports.setNormalCookie = void 0;
    function setNormalCookie(response, cookies, extendedPeriod, path) {
        for (let cookieName in cookies)
            response.cookie(cookieName, cookies[cookieName], {
                maxAge: Date.now() + (extendedPeriod || 0),
                signed: false,
                path
            }).set('Set-Cookie');
    }
    exports.setNormalCookie = setNormalCookie;
    function setSignedCookie(response, cookies, extendedPeriod, path) {
        for (let cookieName in cookies)
            response.cookie(cookieName, cookies[cookieName], {
                maxAge: Date.now() + (extendedPeriod || 0),
                signed: true,
                path
            }).set('Set-Cookie');
    }
    exports.setSignedCookie = setSignedCookie;
});
define("src/utility/__tests__/encryption.test", ["require", "exports", "crypto", "src/constants"], function (require, exports, crypto_4, constants_60) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const data = "abcxyz";
    let authTag = null;
    const encryption = jest.fn((data) => {
        const cipher = (0, crypto_4.createCipheriv)("aes-256-gcm", constants_60.RAW_CIPHER_KEY, constants_60.RAW_CIPHER_IV);
        const newBuffer = Buffer.concat([cipher.update(data), cipher.final()]);
        authTag = cipher.getAuthTag();
        return newBuffer;
    });
    const decryption = jest.fn((data) => {
        const decipher = (0, crypto_4.createDecipheriv)("aes-256-gcm", constants_60.RAW_CIPHER_KEY, constants_60.RAW_CIPHER_IV);
        decipher.setAuthTag(authTag);
        return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf-8');
    });
    it("should encrypt and decipher data", () => {
        for (let i = 0; i < 10; i++) {
            let encText = encryption(data);
            let text = decryption(encText);
            expect(text).toBe(data);
        }
    });
});
define("src/utility/__tests__/intersection.test", ["require", "exports", "src/utility/intersection"], function (require, exports, intersection_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    it("should produce an intersected array", () => {
        const result = (0, intersection_2.intersectArrays)([1000, 234125, 215, 2, 52, 5, 25, 12, 5], [2, 5, 632, 5356, 46, 46, 436, 34, 643]);
        expect(result.length).toBe(2);
    });
    it("should not produce an intersected array", () => {
        const result = (0, intersection_2.intersectArrays)([1000, 234125, 215, 2, 52, 5, 25, 12, 5], [8, 76, 632, 5356, 46, 46, 436, 34, 643]);
        expect(result.length).toBe(0);
    });
});
define("temp/testFirebase", ["require", "exports", "firebase/app", "firebase/auth", "firebase/storage", "src/constants"], function (require, exports, app_2, auth_2, storage_1, constants_61) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const app = (0, app_2.initializeApp)(constants_61.FIREBASE_CONFIG);
    const auth = (0, auth_2.getAuth)(app);
    const storage = (0, storage_1.getStorage)(app);
    const downloadableFile = (0, storage_1.ref)(storage, "snapshots/test/Hello");
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = yield (0, auth_2.signInWithEmailAndPassword)(auth, "asd135hp1@gmail.com", "123456789");
        console.log(yield (0, storage_1.getBytes)(downloadableFile));
    }))();
});
//# sourceMappingURL=index.js.map