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
const constants_1 = require("../../../../constants");
const subscriptionImplementor_1 = require("../../../../model/patterns/subscriptionImplementor");
const databaseErrorEvent_1 = __importDefault(require("../../../../model/v1/events/databaseErrorEvent"));
const filterDatabaseEvent_1 = require("../../../../utility/filterDatabaseEvent");
class EventBusSubscriber extends subscriptionImplementor_1.SubscriberImplementor {
    constructor(linkedPublisher) {
        super();
        this.linkedPublisher = linkedPublisher;
    }
    onNextAsync(event) {
        return __awaiter(this, void 0, void 0, function* () {
            constants_1.logger.debug("EventBus.onNextAsync is called");
            return (0, filterDatabaseEvent_1.filterDatabaseEvent)(yield this.linkedPublisher.notifyAsync(event)).unwrapOrElse(() => {
                constants_1.logger.error("EventBus: DatabaseEvent filtration leads to all error");
                return new databaseErrorEvent_1.default("The action is failed to be executed", 400);
            });
        });
    }
    onNext(event) {
        constants_1.logger.debug("EventBus.onNext is called");
        super.onNext(event);
        this.linkedPublisher.notify(event);
    }
}
class EventBus extends subscriptionImplementor_1.PublisherImplementor {
    constructor(...publishers) {
        super();
        this.eventBusSubscriber = new EventBusSubscriber(this);
        publishers.map(publisher => this.eventBusSubscriber.subscribe(publisher));
        constants_1.logger.debug("Initialized EventBus");
    }
}
exports.default = EventBus;
//# sourceMappingURL=eventBus.js.map