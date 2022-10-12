import { Query } from "@firebase/database-types";
import { None, Option } from "../../model/patterns/option";
import { getQueryResultAsArray } from "../../controller/database/firebase/services/firebaseRealtimeService";
import { persistentFirebaseConnection } from "../../controller/v1/services/firebaseFreetier/firebaseService";
import { logger } from "../../constants";
import DatabaseErrorEvent from "../../model/v1/events/databaseErrorEvent";
import DatabaseEvent from "../../model/v1/events/databaseEvent";
import { filterDatabaseEvent } from "../filterDatabaseEvent";
import { PublisherImplementor } from "../../model/patterns/subscriptionImplementor";

const realtime = persistentFirebaseConnection.realtimeService

type RealtimeDatabaseAPIOptions = {
  limitToFirst?: number,
  equalToValue?: string | number | boolean
}

/**
 * Generic implementation of getting a realtime content. Could be better implemented
 * @param documentPath 
 * @param field 
 * @param options 
 * @returns 
 */
export async function getRealtimeContent(documentPath: string, field?: string, options?: RealtimeDatabaseAPIOptions): Promise<Option<any[]>> {
  let result: Option<any[]> = None;
  await realtime.getContent(documentPath, async ref => {
    let query: Query = null
    if(field) query = ref.orderByChild(field)
    if(options?.equalToValue) query = (query ?? ref).equalTo(options.equalToValue)
    if(typeof(options?.limitToFirst) === 'number') query = (query ?? ref).limitToFirst(options.limitToFirst)

    result = await getQueryResultAsArray(query ?? ref.limitToFirst(100))
  }).catch(()=>{})
  return result
}

type WriteOptions = {
  data: any,
  protectedMethods: { write: (_: DatabaseEvent)=>Promise<void>, read: ()=>Promise<void> }
  serverLogErrorMsg: string,
  publisher: PublisherImplementor<DatabaseEvent>
}

/**
 * Super generic write event that guarantees communication through the complicated CQRS
 * @param param0 
 * @param DatabaseEventType Type of event to be used instead of a generic DatabaseEvent object
 * @returns 
 */
export async function createWriteEvent({
  data, protectedMethods,
  publisher, serverLogErrorMsg
}: WriteOptions, DatabaseEventType: typeof DatabaseEvent) {
  const event = new DatabaseEventType({
    ...data,
    protected: protectedMethods
  });

  // must have a publisher to add sensor, else an error will be thrown
  return filterDatabaseEvent(await publisher.notifyAsync(event)).unwrapOrElse(()=>{
    logger.error(serverLogErrorMsg)
    return new DatabaseErrorEvent("The action is failed to be executed", 400)
  })
}