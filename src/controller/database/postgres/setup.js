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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPostgreSQL = exports.dropSchema = exports.dropAllTables = void 0;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const constants_1 = require("../../../constants");
const client_1 = require("./client");
function dropAllTables(isTest = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, client_1.transactionWrapper)((pool) => __awaiter(this, void 0, void 0, function* () {
            yield pool.query(yield (0, promises_1.readFile)(path_1.default.join(__dirname, isTest ? "/sql/dropTestTables.sql" : "/sql/dropTables.sql"), { encoding: "utf8" }));
        }));
    });
}
exports.dropAllTables = dropAllTables;
function dropSchema() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, client_1.transactionWrapper)((pool) => __awaiter(this, void 0, void 0, function* () {
            yield pool.query(`DROP SCHEMA ${constants_1.schemaName} CASCADE;`);
        }));
    });
}
exports.dropSchema = dropSchema;
function setupPostgreSQL(isTest = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, client_1.clientWrapper)((pool) => __awaiter(this, void 0, void 0, function* () {
            const tableCreationQuery = yield (0, promises_1.readFile)(path_1.default.join(__dirname, isTest ? "/sql/createTestTables.sql" : "/sql/createTables.sql"), { encoding: "utf8" });
            for (const creationQuery of tableCreationQuery.split("\r\n\r\n")) {
                try {
                    constants_1.logger.info(creationQuery);
                    yield pool.query(creationQuery)
                        .then(val => constants_1.logger.info(val), err => constants_1.logger.error(err));
                }
                catch (e) {
                    constants_1.logger.error(e);
                }
            }
        }));
    });
}
exports.setupPostgreSQL = setupPostgreSQL;
//# sourceMappingURL=setup.js.map