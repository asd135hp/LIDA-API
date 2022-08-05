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
exports.clientWrapper = exports.transactionWrapper = void 0;
const pg_1 = require("pg");
const constants_1 = require("../../constants");
function transactionWrapper(callback, ...params) {
    return __awaiter(this, void 0, void 0, function* () {
        constants_1.logger.info("Created a PostgreSQL transaction wrapper");
        return clientWrapper((pool) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield pool.query("BEGIN");
                const result = yield callback(pool, ...params);
                yield pool.query("COMMIT");
                return result;
            }
            catch (e) {
                yield pool.query("ROLLBACK");
                constants_1.logger.error(`An error occurred when making a data transaction: ${e.message}.\nStack trace: ${e.trace}`);
                return null;
            }
            finally {
                constants_1.logger.info("Finished PostgreSQL transaction wrapper");
            }
        }), ...params);
    });
}
exports.transactionWrapper = transactionWrapper;
function clientWrapper(callback, ...params) {
    return __awaiter(this, void 0, void 0, function* () {
        constants_1.logger.info("Created a PostgreSQL client wrapper");
        let pool;
        try {
            pool = yield new pg_1.Pool({
                connectionString: constants_1.dbConnection.databaseUrl,
                ssl: constants_1.dbConnection.ssl
            }).connect();
            let result = yield callback(pool, ...params);
            return result;
        }
        catch (e) {
            constants_1.logger.error(`An error occurred when making a data request: ${e.message}. Stack trace: ${e.trace}`);
        }
        finally {
            pool === null || pool === void 0 ? void 0 : pool.release();
            constants_1.logger.info("Finished PostgreSQL client wrapper");
        }
    });
}
exports.clientWrapper = clientWrapper;
//# sourceMappingURL=client.js.map