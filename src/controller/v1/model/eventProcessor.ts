import { logger } from "../../../constants";
import { Publisher } from "../../../model/patterns/subscription";
import { SubscriberImplementor } from "../../../model/patterns/subscriptionImplementor";
import DatabaseErrorEvent from "../../../model/v1/events/databaseErrorEvent";
import DatabaseEvent from "../../../model/v1/events/databaseEvent";
import parseError from "./utility/parseError";

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
        logger.error(`Reason of failure: "${JSON.stringify(reason)}"`)
        const e = parseError(reason)
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