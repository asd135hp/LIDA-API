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
const client_1 = require("../controller/database/client");
class LoginService {
    authenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, client_1.clientWrapper)((client) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const row = (_a = (yield client.query("SELECT * FROM users WHERE email=$1", [email]))) === null || _a === void 0 ? void 0 : _a.rows[0];
                if (!row)
                    return { message: "Incorrect email or password" };
                return { user: row };
            }));
        });
    }
}
exports.default = LoginService;
//# sourceMappingURL=loginService.js.map