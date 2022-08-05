"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
function dbClientWrapper(callback) {
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    pool.connect();
    callback(pool);
    pool.end();
}
exports.default = dbClientWrapper;
//# sourceMappingURL=stateless.js.map