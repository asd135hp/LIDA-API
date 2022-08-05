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
const databaseWriteEvent_1 = __importDefault(require("../../../model/v1/events/databaseWriteEvent"));
const subscriptionImplementor_1 = require("../../../model/patterns/subscriptionImplementor");
const client_1 = require("../../database/client");
class WriteModelSubscriber extends subscriptionImplementor_1.SubscriberImplementor {
    constructor(linkedPublisher) {
        super();
        this.linkedPublisher = linkedPublisher;
    }
    onNext(event) {
        super.onNext(event);
        this.linkedPublisher.notify(this.fromReceivedEventToForwardingEvent(event));
        (0, client_1.transactionWrapper)((client) => __awaiter(this, void 0, void 0, function* () {
            yield client.query(event.query, event.params);
        }));
        constants_1.logger.info("Added background work for data transaction");
    }
    fromReceivedEventToForwardingEvent(receivedEvent, ...params) {
        return new databaseWriteEvent_1.default(receivedEvent.query, receivedEvent.params, receivedEvent.content);
    }
}
class WriteModel extends subscriptionImplementor_1.PublisherImplementor {
    constructor(publisher) {
        super();
        this.writeModelSubscriber = new WriteModelSubscriber(this);
        this.writeModelSubscriber.subscribe(publisher);
        constants_1.logger.info("Initialized WriteModel");
    }
}
exports.default = WriteModel;
//# sourceMappingURL=writeModel.js.map