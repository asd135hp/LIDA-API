"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
const constants_1 = require("./constants");
const databaseErrorEvent_1 = __importDefault(require("./model/v1/events/databaseErrorEvent"));
function validationError(err, req) {
    constants_1.logger.error(`
    Caught Validation Error for ${req.path}: ${JSON.stringify(err.fields)}.
    Message named ${err.name}: ${err.message}.
    Stack trace: ${err.stack}.`);
    return new databaseErrorEvent_1.default(JSON.stringify({
        message: "Validation Failed: ",
        details: err === null || err === void 0 ? void 0 : err.fields,
    }), 500);
}
function genericError(err, req) {
    constants_1.logger.error(`
    Caught Error for ${req.path}: ${err.message}.
    Stack trace: ${err.stack}.
  `);
    if (err.message === "Unsupported state or unable to authenticate data")
        return new databaseErrorEvent_1.default("Wrong credentials. Unable to authenticate data", 500);
    return new databaseErrorEvent_1.default("Internal Server Error", 500);
}
function typeError(err, req) {
    constants_1.logger.error(`
    Caught TypeError for ${req.path}: ${err.message}.
    Stack trace: ${err.stack}.`);
    return new databaseErrorEvent_1.default("Internal Server Error", 500);
}
function serverErrorHandler(err, req, res, next) {
    if (err instanceof tsoa_1.ValidateError)
        return res.status(422).json(validationError(err, req));
    if (err instanceof TypeError)
        return res.status(500).json(typeError(err, req));
    if (err instanceof Error)
        return res.status(500).json(genericError(err, req));
    if (typeof (err) == 'object') {
        const newErr = err;
        if (!newErr)
            return res.status(500).json({ message: "Unknown error" });
        return res.status(newErr.type == "Security" ? 403 : 500).json(err);
    }
    next();
}
exports.default = serverErrorHandler;
//# sourceMappingURL=serverErrorHandler.js.map