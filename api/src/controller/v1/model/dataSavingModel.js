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
class DataSavingModelSubscriber extends subscriptionImplementor_1.SubscriberImplementor {
    constructor(linkedPublisher) {
        super();
        this.linkedPublisher = linkedPublisher;
    }
    onNextAsync(event) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.debug("DataSavingModel.onNextAsync is called");
            const newEvent = yield this.linkedPublisher.commitChanges(event);
            if (!(newEvent instanceof databaseErrorEvent_1.default)) {
                this.linkedPublisher.notify(event);
            }
            return newEvent;
        });
    }
    onNext(event) {
        constants_1.logger.debug("DataSavingModel.onNext is called");
        super.onNext(event);
        Promise.all([this.linkedPublisher.commitChanges(event)]);
        this.linkedPublisher.notify(event);
    }
}
class DataSavingModel extends subscriptionImplementor_1.PublisherImplementor {
    constructor(publisher) {
        super();
        this.dataSavingModelSubscriber = new DataSavingModelSubscriber(this);
        this.dataSavingModelSubscriber.subscribe(publisher);
        constants_1.logger.debug("Initialized DataSavingModel");
    }
    commitChanges(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const protectedSpec = event.content.values.protected;
            if (!(protectedSpec === null || protectedSpec === void 0 ? void 0 : protectedSpec.storage)) {
                constants_1.logger.error("Procedure for storage system is not specified");
                return new databaseErrorEvent_1.default("Could not process data", 400);
            }
            return yield event.content.values.protected.storage(event).then(() => event, (reason) => {
                constants_1.logger.error("Failed in processing storage procedure");
                constants_1.logger.error(`Reason of failure: "${reason}"`);
                const isStr = reason && typeof (reason) === 'string';
                const e = new databaseErrorEvent_1.default(isStr ? reason.slice(3) : "Could not retrieve data from the database, please try again later!", isStr ? Math.max(parseInt(reason.slice(0, 3)), 400) : 408);
                e.content.warning = event.content.warning;
                return e;
            });
        });
    }
}
exports.default = DataSavingModel;
//# sourceMappingURL=dataSavingModel.js.map