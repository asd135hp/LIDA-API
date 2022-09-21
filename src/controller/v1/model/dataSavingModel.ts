import { logger } from "../../../constants";
import { Publisher } from "../../../model/patterns/subscription";
import { SubscriberImplementor, PublisherImplementor } from "../../../model/patterns/subscriptionImplementor";
import DatabaseErrorEvent from "../../../model/v1/events/databaseErrorEvent";
import DatabaseEvent from "../../../model/v1/events/databaseEvent";
import parseError from "./utility/parseError";

type Ev = DatabaseEvent

class DataSavingModelSubscriber extends SubscriberImplementor<Ev> {
  private linkedPublisher: PublisherImplementor<Ev>;

  /**
   * @param linkedPublisher Linked publisher should be DataSavingModel since this is a helper class
   * with an aim to force DataSavingModel to notify received event of this class to all of its subscribers
   */
  constructor(linkedPublisher: PublisherImplementor<Ev>){
    super()
    this.linkedPublisher = linkedPublisher
  }

  async onNextAsync(event: Ev): Promise<DatabaseEvent> {
    logger.debug("DataSavingModel.onNextAsync is called")
    
    // if the request does not fail authorisation check then proceed to cascade the event down
    // to other subscribers
    const newEvent = await (this.linkedPublisher as DataSavingModel).commitChanges(event)
    if(!(newEvent instanceof DatabaseErrorEvent)){
      // could try to async notify this since mirror database could fail
      this.linkedPublisher.notify(event)
    }
    return newEvent
  }
  
  // default implementation for onNext method
  onNext(event: DatabaseEvent): void {
    logger.debug("DataSavingModel.onNext is called")
    super.onNext(event)
    Promise.all([(this.linkedPublisher as DataSavingModel).commitChanges(event)])
    this.linkedPublisher.notify(event)
  }
}

export default class DataSavingModel extends PublisherImplementor<Ev> {
  private dataSavingModelSubscriber: DataSavingModelSubscriber;

  /**
   * CommandBus ------> DataSavingModelSubscriber ------> DataSavingModel ------> Subscribers
   *            notify                            forces                  notify
   * @param publisher Should be like CommandBus
   */
  constructor(publisher: Publisher<DatabaseEvent>){
    super();
    this.dataSavingModelSubscriber = new DataSavingModelSubscriber(this)
    this.dataSavingModelSubscriber.subscribe(publisher)
    
    logger.debug("Initialized DataSavingModel")
  }

  async commitChanges(event: DatabaseEvent): Promise<DatabaseEvent>{
    const protectedSpec = event.content.values.protected
    if(!protectedSpec?.storage) {
      // should redirect to 500-ish code
      logger.error("Procedure for storage system is not specified")
      return new DatabaseErrorEvent("Could not process data", 400)
    }

    return await event.content.values.protected.storage(event).then(
      () => event,
      (reason: any) => {
        logger.error("Failed in processing storage procedure")
        logger.error(`Reason of failure: "${JSON.stringify(reason)}"`)
        const e = parseError(reason)
        e.content.warning = event.content.warning
        return e
      }
    )
  }
}