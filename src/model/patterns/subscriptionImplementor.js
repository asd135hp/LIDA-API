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
exports.SubscriberImplementor = exports.PublisherImplementor = void 0;
const constants_1 = require("../../constants");
class PublisherImplementor {
    constructor() {
        this.subscribers = [];
    }
    addSubscriber(subscriber) {
        if (this.subscribers.indexOf(subscriber) == -1) {
            this.subscribers.push(subscriber);
            constants_1.logger.debug(`Added a subscriber to ${this.constructor.name}`);
        }
    }
    notify(newItem) {
        this.subscribers.map(sub => sub.onNext(newItem));
    }
    notifyAsync(newItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            for (const sub of this.subscribers) {
                result.push(yield sub.onNextAsync(newItem));
            }
            return result;
        });
    }
    sendError(error) {
        this.subscribers.map(sub => sub.onError(error));
        constants_1.logger.error(`An error occurred in ${this.constructor.name} and`
            + ` it is sent to all subscribers with following message: ${error}`);
    }
    end() {
        this.subscribers.map(sub => sub.onFinished());
        constants_1.logger.debug(`Ended pipe/connection to subscribers from ${this.constructor.name}`);
    }
    removeSubscriber(subscriber) {
        this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
        constants_1.logger.debug(`Trying to remove a subscriber from ${this.constructor.name}`);
    }
}
exports.PublisherImplementor = PublisherImplementor;
class SubscriberImplementor {
    get event() { return this._event; }
    subscribe(publisher) {
        if (this.unsubscriber !== publisher) {
            this.unsubscriber = publisher;
            publisher.addSubscriber(this);
            constants_1.logger.debug(`${this.constructor.name} subscribed to a publisher named ${publisher.constructor.name}`);
        }
    }
    onNext(event) {
        this._event = event;
        constants_1.logger.debug(`An event is propagated to ${this.constructor.name}`);
    }
    onError(error) {
        constants_1.logger.error(`An error occurred in ${this.constructor.name} with following message: ${error}`);
    }
    onFinished() { this.unsubscribe(); }
    unsubscribe() {
        var _a, _b, _c;
        const name = (_b = (_a = this.unsubscriber) === null || _a === void 0 ? void 0 : _a.constructor.name) !== null && _b !== void 0 ? _b : "null";
        (_c = this.unsubscriber) === null || _c === void 0 ? void 0 : _c.removeSubscriber(this);
        this.unsubscriber = null;
        constants_1.logger.debug(`${this.constructor.name} unsubscribed to its publisher named ${name}`);
    }
}
exports.SubscriberImplementor = SubscriberImplementor;
//# sourceMappingURL=subscriptionImplementor.js.map