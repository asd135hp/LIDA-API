"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
const constants_1 = require("./constants");
function validationError(err, req) {
    constants_1.logger.error(`Caught Validation Error for ${req.path}: ${JSON.stringify(err.fields)}\nMessage named ${err.name}: ${err.message}`);
    return {
        message: "Validation Failed",
        details: err === null || err === void 0 ? void 0 : err.fields,
    };
}
function genericError(err, req) {
    constants_1.logger.error(`Caught Error for ${req.path}: ${err.message}`);
    return {
        message: "Internal Server Error"
    };
}
function typeError(err, req) {
    constants_1.logger.error(`Caught TypeError for ${req.path}: ${err.message}`);
    return {
        message: "Internal Server Error"
    };
}
function serverErrorHandler(err, req, res, next) {
    if (err instanceof tsoa_1.ValidateError)
        return res.status(422).json(validationError(err, req));
    if (err instanceof TypeError)
        return res.status(500).json(typeError(err, req));
    if (err instanceof Error)
        return res.status(500).json(genericError(err, req));
    next();
}
exports.default = serverErrorHandler;
//# sourceMappingURL=serverErrorHandler.js.map