import { DateTime } from "luxon";
import { DATABASE_TIMEZONE, logger } from "../../../../constants";
import { FirebaseDateRange } from "../../../../model/dateRange";
import { IterableJson } from "../../../../model/json";
import { PublisherImplementor } from "../../../../model/patterns/subscriptionImplementor";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { persistentFirebaseConnection } from "./firebaseService";
import DatabaseCreateEvent from "../../../../model/v1/events/databaseCreateEvent";
import DatabaseDeleteEvent from "../../../../model/v1/events/databaseDeleteEvent";
import { filterDatabaseEvent } from "../../../../utility/filterDatabaseEvent";
import { compressJsonDataSync, decompressData } from "../../../../utility/compression";
import { DatabaseSensorData } from "../../../../model/v1/write/sensors";
import { orderByProp } from "../../../../utility/helper";
import { Option, Some, None } from "../../../../model/patterns/option"
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent";

/// TODO: Clean this mess

const storage = persistentFirebaseConnection.storageService;
const SENSOR_FOLDER = "sensor"
const ACTUATOR_FOLDER = "actuator"
const LOG_FOLDER = "log"

/**
 * Utility method - replaces provided dateRange object with its default options
 * @param dateRange 
 * @returns 
 */
function mergeDefaultDateRange(dateRange: FirebaseDateRange): FirebaseDateRange{
  return {
    startDate: dateRange?.startDate || 0,
    endDate: dateRange?.endDate || DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()
  }
}

/**
 * Utility method - Searching for all snapshots within date range
 * @param folderPath 
 * @param dateRange 
 * @param filter
 * @returns An array of objects retrieved from the storage
 */
async function getSnapshotsFromDateRange(
  folderPath: string,
  dateRange: FirebaseDateRange,
  filter?: (json: IterableJson)=>IterableJson
): Promise<Option<IterableJson[]>> {
  // get and filter out snapshots that match the given criteria
  const [files] = await storage.readFolderFromStorage(folderPath)
  if(!files) return None
  
  logger.info(`There are ${files.length} in ${folderPath}`)
  const result = []
  for(const file of files){
    // get meta data and retrieve necessary information from them
    const [metadata] = await file.getMetadata()
    // removes directory and extension so that only file name is used
    const rawFileName = metadata.name.match(/(?<=\/)[^\/]+(?=\.\w+)/g)[0]
    // get file name from base64 encoding to utf-8
    const fileName = Buffer.from(rawFileName, "base64").toString()
    // format: startTimestamp;endTimestamp;decompressedByteLength
    const info = fileName.split(";").map(val => parseInt(val))
    logger.info(info)
    const byteLength = info.pop()
    const [startDate, endDate] = info
    if(endDate <= dateRange.startDate || startDate >= dateRange.endDate) continue;
    
    // decompress downloaded content with data extracted from above
    const downloadContent = await file.download().then(res => res[0])
    const decompressedData = decompressData(downloadContent, byteLength).unwrapOr(null)
    decompressedData && result.push(filter ? filter(decompressedData) : decompressedData)
  }
  return result.length == 0 ? None : Some(result)
}

const lowerCeiling = (data: any, dateRange: FirebaseDateRange) => data.timeStamp >= dateRange.startDate,
  higherCeiling = (data: any, dateRange: FirebaseDateRange) => data.timeStamp <= dateRange.endDate

/**
 * A custom flat function that is basically a flatMap method but with an option to provide a filter
 * @param option 
 * @param dateRange 
 * @param filter 
 * @returns 
 */
const customFlat = (
  option: Option<IterableJson[]>,
  dateRange: FirebaseDateRange,
  filter?: (data: any) => boolean
): Option<any[]> => {
  const result: any[] = []
  option.unwrapOr([]).map((dataByDay, index) => {
    // ensuring type
    if(!Array.isArray(dataByDay)) return
    for(const data of dataByDay){
      if(index != 0 || index != data.length - 1
      || (lowerCeiling(data, dateRange) && higherCeiling(data, dateRange) && (!filter || filter(data))))
        result.push(data)
    }
  })
  return result.length == 0 ? None : Some(result)
}

/**
 * Trim head and tail of a two-dimensional array
 * @param data 
 * @param key 
 * @param dateRange 
 */
const trimData = (data: IterableJson[], key: string, dateRange: FirebaseDateRange) => {
  const lastIndex = data.length - 1
  data[0][key] = data[0][key].filter((data: any) => higherCeiling(data, dateRange))
  data[lastIndex][key] = data[lastIndex][key].filter((data: any) => higherCeiling(data, dateRange))
}

/**
 * Generic method for uploading a snapshot
 * @param snapshot 
 * @param dateRange 
 * @param folder 
 */
const uploadSnapshot = async (
  snapshot: IterableJson,
  dateRange: FirebaseDateRange,
  folder: string,
  publisher: PublisherImplementor<DatabaseEvent>,
  errorOccurrenceLine: number
) => {
  const event = new DatabaseCreateEvent({
    protected: {
      async storage(){
        const option = compressJsonDataSync(snapshot, dateRange)
        if(option.match.isNone()) Promise.reject()
        
        const result = option.unwrapOr(null)
        if(!result) return
        result.fileName = `${folder}/${result.fileName}`
        await storage.uploadBytesToStorage(result.fileName, Buffer.from(result.compressedData))
      }
    }
  })

  return filterDatabaseEvent(await publisher.notifyAsync(event)).unwrapOrElse(()=>{
    logger.error("DataSavingService: DatabaseEvent filtration leads to all error ~ " + errorOccurrenceLine)
    return new DatabaseErrorEvent("The action is failed to be executed", 400)
  })
}

/**
 * Generic implementation of deleting snapshots by folder and date range
 * @param folderName 
 * @param dateRange 
 * @returns 
 */
const deleteSnapshots = async (
  folderName: string,
  dateRange: FirebaseDateRange,
  publisher: PublisherImplementor<DatabaseEvent>
) => {
  dateRange = mergeDefaultDateRange(dateRange)
  const event = new DatabaseDeleteEvent({
    protected: {
      async storage(){
        const files = await getSnapshotsFromDateRange(folderName, dateRange)
        for(const { byteLength, file } of files.unwrapOr([])){
          await file.delete()
        }
      }
    }
  })
  return filterDatabaseEvent(await publisher.notifyAsync(event)).unwrapOrElse(()=>{
    logger.error("DataSavingService: DatabaseEvent filtration leads to all error ~ 289")
    return new DatabaseErrorEvent("The action is failed to be executed", 400)
  })
}

export default class DataSavingService {
  private publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  /**
   * Retrive sensor snapshots in chunks by date
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  async retrieveSensorSnapshots(dateRange?: FirebaseDateRange): Promise<Option<IterableJson[]>> {
    dateRange = mergeDefaultDateRange(dateRange)
    // get ready to merge multiple snapshots together
    // format: [[{sensor1, sensorData1}, {sensor2, sensorData2}, ...], ...]
    const option = await getSnapshotsFromDateRange(SENSOR_FOLDER, dateRange)
    return option.map(data => {
      trimData(data, "sensorData", dateRange)
      return data.length == 0 ? None : Some(data);
    })
  }

  /**
   * Retrieve sensor data in a flattened array
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  async retrieveSensorDataFromSnapshots(
    dateRange?: FirebaseDateRange,
    filter?: (data: DatabaseSensorData) => boolean
  ): Promise<Option<IterableJson[]>> {
    dateRange = mergeDefaultDateRange(dateRange)
    // get ready to merge multiple snapshots together
    // format: [[data1, data2, ...], [data3, data4, ...], ...]
    const data = await getSnapshotsFromDateRange(SENSOR_FOLDER, dateRange, json => json.sensorData);
    return customFlat(data, dateRange, filter)
  }

  /**
   * If this is in demand then it will be implemented.
   * Requesting this method will result in null always for now
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  async retrieveActuatorSnapshots(dateRange?: FirebaseDateRange): Promise<Option<IterableJson[]>> {
    dateRange = mergeDefaultDateRange(dateRange)
    // get ready to merge multiple snapshots together
    // const files = await getSnapshotsFromDateRange(ACTUATOR_FOLDER, dateRange)
    return null;
  }

  /**
   * More performant log snapshots retrieval method since it will only apply filter only on sensor logs
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  async retrieveSensorLogSnapshots(dateRange?: FirebaseDateRange): Promise<Option<IterableJson[]>> {
    dateRange = mergeDefaultDateRange(dateRange)
    // get ready to merge multiple snapshots together
    const data = await getSnapshotsFromDateRange(LOG_FOLDER, dateRange, log => log.sensor)
    return customFlat(data, dateRange)
  }

  /**
   * More performant log snapshots retrieval method since it will only apply filter only on actuator logs
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  async retrieveActuatorLogSnapshots(dateRange?: FirebaseDateRange): Promise<Option<IterableJson[]>> {
    dateRange = mergeDefaultDateRange(dateRange)
    // get ready to merge multiple snapshots together
    const data = await getSnapshotsFromDateRange(LOG_FOLDER, dateRange, log => log.actuator)
    return customFlat(data, dateRange)
  }

  /**
   * Retrieve log snapshots in chunks by date
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  async retrieveLogSnapshots(dateRange?: FirebaseDateRange): Promise<Option<IterableJson[]>> {
    dateRange = mergeDefaultDateRange(dateRange)
    // get ready to merge multiple snapshots together
    const option = await getSnapshotsFromDateRange(LOG_FOLDER, dateRange)
    return option.map(data => {
      trimData(data, "sensor", dateRange)
      trimData(data, "actuator", dateRange)
      return data.length == 0 ? None : Some(data)
    })
  }

  /**
   * Upload what is considered to be a snapshot of sensor data in a period of time to a sensor folder on the server
   * @param snapshot 
   * @param dateRange 
   * @returns 
   */
  async uploadSensorSnapshot(snapshot: IterableJson, dateRange: FirebaseDateRange): Promise<DatabaseEvent> {
    dateRange = mergeDefaultDateRange(dateRange)
    snapshot = {
      sensor: snapshot.sensor.sort(orderByProp("name")),
      sensorData: snapshot.sensorData.sort(orderByProp("sensorName"))
    }

    return await uploadSnapshot(snapshot, dateRange, SENSOR_FOLDER, this.publisher, 257)
  }

  /**
   * Not implemented - no purpose
   * @param snapshot 
   * @param dateRange 
   * @returns 
   */
  async uploadActuatorSnapshot(snapshot: IterableJson, dateRange: FirebaseDateRange): Promise<DatabaseEvent> {
    dateRange = mergeDefaultDateRange(dateRange)
    return null
  }

  /**
   * Upload what is considered to be a snapshot of logs in a period of time to a log folder on the server
   * @param snapshot 
   * @param dateRange 
   * @returns 
   */
  async uploadLogSnapshot(snapshot: IterableJson, dateRange: FirebaseDateRange): Promise<DatabaseEvent> {
    dateRange = mergeDefaultDateRange(dateRange)
    snapshot = {
      sensor: snapshot.sensor.sort(orderByProp("timeStamp")),
      actuator: snapshot.actuator.sort(orderByProp("timeStamp"))
    }
    
    return await uploadSnapshot(snapshot, dateRange, LOG_FOLDER, this.publisher, 284)
  }

  async deleteSensorSnapshots(dateRange: FirebaseDateRange): Promise<DatabaseEvent> {
    return await deleteSnapshots(SENSOR_FOLDER, dateRange, this.publisher)
  }

  async deleteActuatorSnapshots(dateRange: FirebaseDateRange): Promise<DatabaseEvent> {
    return await deleteSnapshots(ACTUATOR_FOLDER, dateRange, this.publisher)
  }

  async deleteLogSnapshots(dateRange: FirebaseDateRange): Promise<DatabaseEvent> {
    return await deleteSnapshots(LOG_FOLDER, dateRange, this.publisher)
  }
}