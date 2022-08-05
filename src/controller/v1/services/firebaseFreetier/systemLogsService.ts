import { DATABASE_TIMEZONE, logger, LOG_LINES } from "../../../../constants";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { PublisherImplementor } from "../../../../model/patterns/subscriptionImplementor";
import { LogDTO } from "../../../../model/v1/read/systemLogDto";
import { Log } from "../../../../model/v1/write/systemLog";
import DatabaseAddEvent from "../../../../model/v1/events/databaseAddEvent";
import { persistentFirebaseConnection } from "./firebaseService";
import { getQueryResult, getQueryResultAsArray } from "../../../database/firebase/services/firebaseRealtimeService";
import { DateTime } from "luxon";
import { Option, Some, None } from "../../../../model/patterns/option"
import { filterDatabaseEvent } from "../../../../utility/filterDatabaseEvent";
import DataSavingService from "./dataSavingService";
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent";
import { createWriteEvent } from "../../../../utility/shorthandOps";

const realtime = persistentFirebaseConnection.realtimeService
const firestore = persistentFirebaseConnection.firestoreService

/**
 * Generic push log to the database based on provided path
 * (assuming firestore and realtime database uses the same path system)
 * @param path Path to the document/json
 * @param log Log to be pushed
 * @returns A DatabaseEvent, either a DatabaseErrorEvent or a modified version of DatabaseEvent
 */
const pushLog = async(
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
        await realtime.getContent(`${path}/logCount`, async ref => {
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
const getLog = async(oldestTimestamp: number, path: string): Promise<any[]> => {
  const dataSavingService = new DataSavingService()
  let result: any[] = (await dataSavingService.retrieveActuatorLogSnapshots({
    startDate: oldestTimestamp
  })).unwrapOr([])

  await realtime.getContent(path, async ref => {
    const temp = (await getQueryResultAsArray(
      ref.orderByChild("timeStamp").limitToLast(LOG_LINES),
      json => json.timeStamp >= oldestTimestamp
    )).unwrapOr([])

    // merge old data with new data
    result = result.slice(result.length - 1 - temp.length).concat(temp)
  })

  return result
}

export default class SystemLogsService {
  private publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  async getSensorLogs(oldestTimestamp: number = 0): Promise<Option<LogDTO[]>> {
    const result = await getLog(oldestTimestamp, "logs/sensor")
    logger.debug(`All logs: ${result}`)
    return result.length ? Some(result.map(json => LogDTO.fromJson(json) as LogDTO)) : None
  }

  async getActuatorLogs(oldestTimestamp: number = 0): Promise<Option<LogDTO[]>> {
    const result = await getLog(oldestTimestamp, "logs/actuator")
    logger.debug(`All logs: ${result}`)
    return result.length ? Some(result.map(json => LogDTO.fromJson(json) as LogDTO)) : None
  }

  async addSensorLog(log: Log): Promise<DatabaseEvent> {
    return await pushLog("logs/sensor", log, this.publisher)
  }

  async addActuatorLog(log: Log): Promise<DatabaseEvent> {
    return await pushLog("logs/actuator", log, this.publisher)
  }
}