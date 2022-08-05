/**
 * Following the implementation of event-driven CQRS from IBM, Event Bus is essential to implement.
 * Sacrifies slow + duplicated implementation rate (of publisher/subscriber)
 * as a trade off to a cleaner code
 * Also, if the code is confusing, then because it is, not your fault
 * @see https://www.ibm.com/cloud/architecture/architectures/event-driven-cqrs-pattern/
 */

import { logger } from "../../../../constants";
import { Publisher } from "../../../../model/patterns/subscription";
import { SubscriberImplementor, PublisherImplementor } from "../../../../model/patterns/subscriptionImplementor";
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { filterDatabaseEvent } from "../../../../utility/filterDatabaseEvent";

type Ev = DatabaseEvent

class EventBusSubscriber extends SubscriberImplementor<Ev> {
  private linkedPublisher: PublisherImplementor<Ev>;

  constructor(linkedPublisher: PublisherImplementor<Ev>){
    super()
    this.linkedPublisher = linkedPublisher
  }

  // reading side could return error so this is necessary to implement
  async onNextAsync(event: DatabaseEvent): Promise<DatabaseEvent> {
    logger.debug("EventBus.onNextAsync is called")
    return filterDatabaseEvent(await this.linkedPublisher.notifyAsync(event)).unwrapOrElse(()=>{
      logger.error("EventBus: DatabaseEvent filtration leads to all error")
      return new DatabaseErrorEvent("The action is failed to be executed", 400)
    })
  }

  // default implementation for onNext method
  onNext(event: DatabaseEvent): void {
    logger.debug("EventBus.onNext is called")
    super.onNext(event)
    this.linkedPublisher.notify(event)
  }
}

export default class EventBus extends PublisherImplementor<Ev> {
  private eventBusSubscriber: EventBusSubscriber;

  /**
   * Get a publisher of CommandBus to subscribe to
   * @param publishers Publishers to subscribe for receiving events for changes in the database
   */
  constructor(...publishers: Publisher<DatabaseEvent>[]){
    super();
    this.eventBusSubscriber = new EventBusSubscriber(this)
    publishers.map(publisher => this.eventBusSubscriber.subscribe(publisher))
    logger.debug("Initialized EventBus")
  }
}