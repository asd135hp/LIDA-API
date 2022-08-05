/**
 * Abstract implementation of Observer patterns that could be overridden easily
 */
import { logger } from "../../constants";
import DatabaseEvent from "../v1/events/databaseEvent";
import { Publisher, Subscriber } from "./subscription";

export abstract class PublisherImplementor<T> implements Publisher<T> {
  private subscribers: Subscriber<T>[];

  constructor(){
    this.subscribers = []
  }

  addSubscriber(subscriber: Subscriber<T>): void {
    if(this.subscribers.indexOf(subscriber) == -1){
      this.subscribers.push(subscriber);
      logger.debug(`Added a subscriber to ${this.constructor.name}`)
    }
  }

  /**
   * Propagating new item to all linked subscribers
   * @param newItem 
   */
  notify(newItem: T){
    this.subscribers.map(sub => sub.onNext(newItem))
  }

  /**
   * Propagating new item to all linked subscribers asynchronously
   * @param newItem
   * @return A DatabaseEvent array got from all linked subscribers
   */
  async notifyAsync(newItem: T): Promise<DatabaseEvent[]> {
    const result = []
    for(const sub of this.subscribers){
      result.push(await sub.onNextAsync(newItem))
    }
    return result
  }

  /**
   * Propagating error to subscribers that this publisher is linked to
   * @param error 
   */
  sendError(error: Error): void {
    this.subscribers.map(sub => sub.onError(error))
    logger.error(`An error occurred in ${this.constructor.name} and`
      + ` it is sent to all subscribers with following message: ${error}`)
  }

  /**
   * Custom method to end all connections with this publisher's subscribers
   */
  end(): void {
    this.subscribers.map(sub => sub.onFinished())
    logger.debug(`Ended pipe/connection to subscribers from ${this.constructor.name}`)
  }

  removeSubscriber(subscriber: Subscriber<T>): void {
    this.subscribers = this.subscribers.filter(sub => sub !== subscriber)
    logger.debug(`Trying to remove a subscriber from ${this.constructor.name}`)
  }
}

export abstract class SubscriberImplementor<T> implements Subscriber<T> {
  private unsubscriber: Publisher<T>;
  private _event: T
  get event(): T { return this._event }

  subscribe(publisher: Publisher<T>): void {
    if(this.unsubscriber !== publisher){
      this.unsubscriber = publisher
      publisher.addSubscriber(this)
      logger.debug(`${this.constructor.name} subscribed to a publisher named ${publisher.constructor.name}`)
    }
  }

  onNext(event: T): void {
    this._event = event
    logger.debug(`An event is propagated to ${this.constructor.name}`)
  }

  abstract onNextAsync(event: T): Promise<DatabaseEvent>;

  onError(error: Error): void {
    logger.error(`An error occurred in ${this.constructor.name} with following message: ${error}`) 
  }

  onFinished(): void { this.unsubscribe() }

  unsubscribe(): void {
    const name = this.unsubscriber?.constructor.name ?? "null"
    this.unsubscriber?.removeSubscriber(this)
    this.unsubscriber = null
    logger.debug(`${this.constructor.name} unsubscribed to its publisher named ${name}`)
  }
}