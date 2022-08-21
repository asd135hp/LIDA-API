import { DateTime } from "luxon"
import { COMPONENTS_PATH, DATABASE_TIMEZONE, LOG_LINES } from "../../../../../constants"
import { PublisherImplementor } from "../../../../../model/patterns/subscriptionImplementor"
import DatabaseAddEvent from "../../../../../model/v1/events/databaseAddEvent"
import DatabaseEvent from "../../../../../model/v1/events/databaseEvent"
import { Log } from "../../../../../model/v1/write/systemLog"
import { createWriteEvent } from "../../../../../utility/shorthandOps"
import { getQueryResult, getQueryResultAsArray } from "../../../../database/firebase/services/firebaseRealtimeService"
import DataSavingService from "../dataSavingService"
import { persistentFirebaseConnection } from "../firebaseService"

const realtime = persistentFirebaseConnection.realtimeService
const firestore = persistentFirebaseConnection.firestoreService

/**
 * Generic push log to the database based on provided path
 * (assuming firestore and realtime database uses the same path system)
 * @param path Path to the document/json
 * @param log Log to be pushed
 * @returns A DatabaseEvent, either a DatabaseErrorEvent or a modified version of DatabaseEvent
 */
export const pushLog = async(
  path: string,
  log: Log,
  publisher: PublisherImplementor<DatabaseEvent>
): Promise<DatabaseEvent> => {
  log.timeStamp = log.timeStamp || DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()
  
  return await createWriteEvent({
    data: log,
    protectedMethods: {
      async write(){
        const collectionPath = path
        // this is much better than array union
        await firestore.addContentToCollection(`${collectionPath}/content`, log)
      },
      async read(){
        await realtime.getContent(COMPONENTS_PATH.count.logs, async ref => {
          // looks more clean - update log count
          const count = (await ref.transaction(val => {
            if(typeof(val) !== 'number') return 1
            if(val < LOG_LINES) return val + 1
            return val
          })).snapshot.val()

          // trim out the oldest line to match the limit
          if(count >= LOG_LINES) realtime.getContent(path, async ref => {
            const temp = await getQueryResult(ref.orderByChild("timeStamp").limitToFirst(1))
            for(const key in temp)
              await realtime.deleteContent(`${path}/${key}`)
          })
          realtime.pushContent(log, path)
        })
      }
    },
    publisher,
    serverLogErrorMsg: "SystemLogsService: DatabaseEvent filtration leads to all error ~ 63"
  }, DatabaseAddEvent)
}

/**
 * A generic implementation of getting a log
 * @param oldestTimestamp 
 * @param path Points to a reference in the realtime database
 * @returns 
 */
export const getLog = async(oldestTimestamp: number, path: string): Promise<any[]> => {
  const dataSavingService = new DataSavingService()
  let result: any[] = (await dataSavingService.retrieveActuatorLogSnapshots({
    startDate: oldestTimestamp
  })).unwrapOr([])

  await realtime.getContent(path, async ref => {
    const temp = (await getQueryResultAsArray(
      ref.orderByChild("timeStamp").limitToLast(LOG_LINES),
      json => json.timeStamp >= oldestTimestamp
    )).unwrapOr([])
    const len = temp.length

    // merge old data with new data if it is below the threshold
    if(len < LOG_LINES) result = result.slice(result.length - LOG_LINES + len).concat(temp)
    else result = temp
  })

  return result
}