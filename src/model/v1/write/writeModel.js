"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionImplementor_1 = require("../../patterns/subscriptionImplementor");
const writeToLogsDatabase = (receivedEvent) => {
};
const commitToMainRecords = (receivedEvent) => {
};
class WriteModelSubscriber extends subscriptionImplementor_1.SubscriberImplementor {
    constructor(linkedPublisher) {
        super();
        this.linkedPublisher = linkedPublisher;
    }
    onNext(event) {
        super.onNext(event);
        this.linkedPublisher.notify(this.fromReceivedEventToForwardingEvent(event));
        writeToLogsDatabase(event);
        commitToMainRecords(event);
    }
    fromReceivedEventToForwardingEvent(receivedEvent) {
        return null;
    }
}
class WriteModel extends subscriptionImplementor_1.PublisherImplementor {
    constructor(publisher) {
        super();
        this.writeModelSubscriber = new WriteModelSubscriber(this);
        this.writeModelSubscriber.subscribe(publisher);
    }
}
exports.default = WriteModel;
//# sourceMappingURL=writeModel.js.map