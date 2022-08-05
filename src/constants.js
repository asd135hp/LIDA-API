"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_ACCOUNT_CREDENTIALS = exports.FIREBASE_CONFIG = exports.CIPHER_ALGORITHM = exports.RAW_CIPHER_IV = exports.RAW_CIPHER_KEY = exports.SESSION_SECRET = exports.COOKIE_SECRET = exports.TEST_ACCOUNT = exports.TEST_SETUP_THROWS_ERROR = exports.COMPRESSION_SETTINGS = exports.PROMISE_CATCH_METHOD = exports.ACTUATOR_LIMIT = exports.SENSOR_LIMIT = exports.LOG_LINES = exports.DATABASE_TIMEZONE = exports.schemaName = exports.firebasePathConfig = exports.logger = exports.dbConnection = void 0;
const winston_1 = __importDefault(require("winston"));
const constants_config_json_1 = __importDefault(require("./constants.config.json"));
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
    format: winston_1.default.format.json(),
    defaultMeta: constants_config_json_1.default.logger.defaultMeta,
    transports: [
        new winston_1.default.transports.File(constants_config_json_1.default.logger.transport.errorLog),
        new winston_1.default.transports.File(constants_config_json_1.default.logger.transport.debugLog),
    ],
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
const PROMISE_CATCH_METHOD = (reason) => { exports.logger.error(reason); return reason; };
exports.PROMISE_CATCH_METHOD = PROMISE_CATCH_METHOD;
exports.COMPRESSION_SETTINGS = constants_config_json_1.default.compression;
exports.TEST_SETUP_THROWS_ERROR = constants_config_json_1.default.test.setupThrowsError;
exports.TEST_ACCOUNT = constants_config_json_1.default.test.account;
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
//# sourceMappingURL=constants.js.map