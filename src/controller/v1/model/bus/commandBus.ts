/**
 * Following the implementation of event-driven CQRS from IBM, Command Bus is optional to implement.
 * Sacrifies slow + duplicated implementation rate (of publisher/subscriber)
 * as a trade off to a cleaner code
 * Also, this is SOLID compliant
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

// plug in middle man class to pass down event from the main Publisher class
// which in this case is a CommandBus
class CommandBusSubscriber extends SubscriberImplementor<Ev> {
  private linkedPublisher: PublisherImplementor<Ev>;

  /**
   * @param linkedPublisher Linked publisher should be CommandBus since this is a helper class
   * with an aim to force CommandBus to notify received event of this class to all of its subscribers
   */
  constructor(linkedPublisher: PublisherImplementor<Ev>){
    super()
    this.linkedPublisher = linkedPublisher
  }

  async onNextAsync(event: DatabaseEvent): Promise<DatabaseEvent> {
    logger.debug("CommandBus.onNextAsync is called")
    return filterDatabaseEvent(await this.linkedPublisher.notifyAsync(event)).unwrapOrElse(()=>{
      logger.error("CommandBus: DatabaseEvent filtration leads to all error")
      return new DatabaseErrorEvent("The action is failed to be executed", 400)
    })
  }
  
  // default implementation for onNext method
  onNext(event: DatabaseEvent): void {
    logger.debug("CommandBus.onNext is called")
    super.onNext(event)
    this.linkedPublisher.notify(event)
  }
}

export default class CommandBus extends PublisherImplementor<Ev> {
  private commandBusSubscriber: CommandBusSubscriber;

  /**
   * CommandFacade ------> CommandBusSubscriber ------> CommandBus ------> Subscribers
   *               notify                       forces             notify
   * @param publishers Should be a publisher that connects to all available services used by the API
   */
  constructor(...publishers: Publisher<DatabaseEvent>[]){
    super();
    this.commandBusSubscriber = new CommandBusSubscriber(this)
    publishers.map(publisher => this.commandBusSubscriber.subscribe(publisher))
    logger.debug("Initialized CommandBus")
  }
}