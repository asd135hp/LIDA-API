import { logger } from "../../../constants";
import { Publisher } from "../../../model/patterns/subscription";
import { SubscriberImplementor, PublisherImplementor } from "../../../model/patterns/subscriptionImplementor";
import DatabaseErrorEvent from "../../../model/v1/events/databaseErrorEvent";
import DatabaseEvent from "../../../model/v1/events/databaseEvent";
import { filterDatabaseEvent } from "../../../utility/filterDatabaseEvent";
import { persistentFirebaseConnection } from "../services/firebaseFreetier/firebaseService";

type Ev = DatabaseEvent

class WriteModelSubscriber extends SubscriberImplementor<Ev> {
  private linkedPublisher: PublisherImplementor<Ev>;

  /**
   * @param linkedPublisher Linked publisher should be WriteModel since this is a helper class
   * with an aim to force WriteModel to notify received event of this class to all of its subscribers
   */
  constructor(linkedPublisher: PublisherImplementor<Ev>){
    super()
    this.linkedPublisher = linkedPublisher
  }

  async onNextAsync(event: Ev): Promise<DatabaseEvent> {
    logger.debug("WriteModel.onNextAsync is called")

    // if the request does not fail authorisation check then proceed to cascade the event down
    // to other subscribers
    const newEvent = (this.linkedPublisher as WriteModel).commitChanges(event)
    if(!(newEvent instanceof DatabaseErrorEvent)){
      // non-async notify to cut off communication between Write and Read responsibility planes
      // this.linkedPublisher.notify(event)

      // async notify this since mirrored database could fail
      if(!await this.retryAsyncNotification(event)){
        logger.error("Query database (mirror database) encountered problem!")
        return new DatabaseErrorEvent("Database encountered problem. Please try again later", 500)
      }
    }
    logger.info("Added background work for data transaction")
    return newEvent
  }

  // default implementation for onNext method
  onNext(event: DatabaseEvent): void {
    logger.debug("WriteModel.onNext is called")
    super.onNext(event)
    Promise.all([(this.linkedPublisher as WriteModel).commitChanges(event)])
    this.linkedPublisher.notify(event)
  }

  // modularisation
  private async retryAsyncNotification(event: DatabaseEvent): Promise<boolean>{
    let childEvents = await this.linkedPublisher.notifyAsync(event)
    let retry = 3

    // retry connection
    while(retry != 0){
      if(filterDatabaseEvent(childEvents) instanceof DatabaseErrorEvent){
        childEvents = await this.linkedPublisher.notifyAsync(event)
        retry--
        continue
      }
      break
    }
    
    // whether mirror database is failed or not (retry is 0 means failed)
    return retry != 0
  }
}

export default class WriteModel extends PublisherImplementor<Ev> {
  private writeModelSubscriber: WriteModelSubscriber;

  /**
   * CommandBus ------> WriteModelSubscriber ------> WriteModel ------> Subscribers
   *            notify                       forces             notify
   * @param publisher Should be like CommandBus
   */
  constructor(publisher: Publisher<DatabaseEvent>){
    super();
    this.writeModelSubscriber = new WriteModelSubscriber(this)
    this.writeModelSubscriber.subscribe(publisher)
    
    logger.debug("Initialized WriteModel")
  }

  async commitChanges(event: DatabaseEvent): Promise<DatabaseEvent>{
    const protectedSpec = event.content.values.protected
    if(!protectedSpec?.write) {
      // should redirect to 500-ish code
      logger.error("Procedure for command database is not specified")
      return new DatabaseErrorEvent("Could not process data", 400)
    }

    return await protectedSpec.write(event).then(
      () => (logger.debug("Finished processing procedure for command database"), event),
      (reason: any) => {
        logger.error("Failed in processing procedure for command database")
        logger.error(`Reason of failure: "${reason}"`)
        const isStr = reason && typeof(reason) === 'string'
        const e = new DatabaseErrorEvent(
          isStr ? reason.slice(3) : "Could not retrieve data from the database, please try again later!",
          // HTTP error status code starts from 400
          isStr ? Math.max(parseInt(reason.slice(0, 3)), 400) : 408
        )
        e.content.warning = event.content.warning
        return e
      }
    )
  }
}