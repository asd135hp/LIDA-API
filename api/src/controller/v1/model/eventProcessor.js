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
const constants_1 = require("../../../constants");
const subscriptionImplementor_1 = require("../../../model/patterns/subscriptionImplementor");
const databaseErrorEvent_1 = __importDefault(require("../../../model/v1/events/databaseErrorEvent"));
const parseError_1 = __importDefault(require("./utility/parseError"));
class EventProcessor extends subscriptionImplementor_1.SubscriberImplementor {
    constructor(publisher) {
        super();
        this.subscribe(publisher);
    }
    onNextAsync(event) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.debug("EventProcessor.onNextAsync is called");
            const p = event.content.values.protected;
            if (!(p === null || p === void 0 ? void 0 : p.read)) {
                constants_1.logger.error("Procedure for query database is not specified");
                return new databaseErrorEvent_1.default("Could not process data", 400);
            }
            return yield event.content.values.protected.read(event).then(() => event, (reason) => {
                constants_1.logger.error("Failed in processing procedure for updating query database");
                constants_1.logger.error(`Reason of failure: "${JSON.stringify(reason)}"`);
                const e = (0, parseError_1.default)(reason);
                e.content.warning = event.content.warning;
                return e;
            });
        });
    }
    onNext(event) {
        var _a;
        constants_1.logger.debug("EventProcessor.onNext is called");
        super.onNext(event);
        if ((_a = event.content.values.protected) === null || _a === void 0 ? void 0 : _a.read)
            Promise.all([event.content.values.protected.read(event)]);
    }
}
exports.default = EventProcessor;
//# sourceMappingURL=eventProcessor.js.map