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
const filterDatabaseEvent_1 = require("../../../utility/filterDatabaseEvent");
const parseError_1 = __importDefault(require("./utility/parseError"));
class WriteModelSubscriber extends subscriptionImplementor_1.SubscriberImplementor {
    constructor(linkedPublisher) {
        super();
        this.linkedPublisher = linkedPublisher;
    }
    onNextAsync(event) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.debug("WriteModel.onNextAsync is called");
            const newEvent = this.linkedPublisher.commitChanges(event);
            if (!(newEvent instanceof databaseErrorEvent_1.default)) {
                if (!(yield this.retryAsyncNotification(event))) {
                    constants_1.logger.error("Query database (mirror database) encountered problem!");
                    return new databaseErrorEvent_1.default("Database encountered problem. Please try again later", 500);
                }
            }
            constants_1.logger.info("Added background work for data transaction");
            return newEvent;
        });
    }
    onNext(event) {
        constants_1.logger.debug("WriteModel.onNext is called");
        super.onNext(event);
        Promise.all([this.linkedPublisher.commitChanges(event)]);
        this.linkedPublisher.notify(event);
    }
    retryAsyncNotification(event) {
        return __awaiter(this, void 0, void 0, function* () {
            let childEvents = yield this.linkedPublisher.notifyAsync(event);
            let retry = 3;
            while (retry != 0) {
                if ((0, filterDatabaseEvent_1.filterDatabaseEvent)(childEvents) instanceof databaseErrorEvent_1.default) {
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
class WriteModel extends subscriptionImplementor_1.PublisherImplementor {
    constructor(publisher) {
        super();
        this.writeModelSubscriber = new WriteModelSubscriber(this);
        this.writeModelSubscriber.subscribe(publisher);
        constants_1.logger.debug("Initialized WriteModel");
    }
    commitChanges(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const protectedSpec = event.content.values.protected;
            if (!(protectedSpec === null || protectedSpec === void 0 ? void 0 : protectedSpec.write)) {
                constants_1.logger.error("Procedure for command database is not specified");
                return new databaseErrorEvent_1.default("Could not process data", 400);
            }
            return yield protectedSpec.write(event).then(() => (constants_1.logger.debug("Finished processing procedure for command database"), event), (reason) => {
                constants_1.logger.error("Failed in processing procedure for command database");
                constants_1.logger.error(`Reason of failure: "${JSON.stringify(reason)}"`);
                const e = (0, parseError_1.default)(reason);
                e.content.warning = event.content.warning;
                return e;
            });
        });
    }
}
exports.default = WriteModel;
//# sourceMappingURL=writeModel.js.map