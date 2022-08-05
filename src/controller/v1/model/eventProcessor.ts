import { logger } from "../../../constants";
import { Publisher } from "../../../model/patterns/subscription";
import { SubscriberImplementor } from "../../../model/patterns/subscriptionImplementor";
import DatabaseErrorEvent from "../../../model/v1/events/databaseErrorEvent";
import DatabaseEvent from "../../../model/v1/events/databaseEvent";

export default class EventProcessor extends SubscriberImplementor<DatabaseEvent> {
  constructor(publisher: Publisher<DatabaseEvent>){
    super();
    this.subscribe(publisher)
  }

  async onNextAsync(event: DatabaseEvent): Promise<DatabaseEvent> {
    logger.debug("EventProcessor.onNextAsync is called")
    const p = event.content.values.protected
    if(!p?.read) {
      // should redirect to 500-ish code
      logger.error("Procedure for query database is not specified")
      return new DatabaseErrorEvent("Could not process data", 400)
    }

    return await event.content.values.protected.read(event).then(
      () => event,
      (reason: any) => {
        logger.error("Failed in processing procedure for updating query database")
        logger.error(`Reason of failure: "${reason}"`)
        const isStr = reason && typeof(reason) === 'string'
        const e = new DatabaseErrorEvent(
          isStr ? reason.slice(3) : "Could not retrieve data from query database, please try again later!",
          // HTTP error status code starts from 400
          isStr ? Math.max(parseInt(reason.slice(0, 3)), 400) : 408
        )
        e.content.warning = event.content.warning
        return e
      }
    )
  }

  onNext(event: DatabaseEvent): void {
    logger.debug("EventProcessor.onNext is called")
    super.onNext(event)
    // update the mirror of real database
    if(event.content.values.protected?.read)
      Promise.all([event.content.values.protected.read(event)])
  }
}