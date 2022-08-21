import { DateTime } from "luxon";
import { DATABASE_TIMEZONE, logger } from "../../../../../constants";
import { FirebaseDateRange } from "../../../../../model/dateRange";
import { IterableJson } from "../../../../../model/json";
import { PublisherImplementor } from "../../../../../model/patterns/subscriptionImplementor";
import DatabaseCreateEvent from "../../../../../model/v1/events/databaseCreateEvent";
import DatabaseDeleteEvent from "../../../../../model/v1/events/databaseDeleteEvent";
import DatabaseErrorEvent from "../../../../../model/v1/events/databaseErrorEvent";
import DatabaseEvent from "../../../../../model/v1/events/databaseEvent";
import { decompressData, compressJsonDataSync } from "../../../../../utility/compression";
import { filterDatabaseEvent } from "../../../../../utility/filterDatabaseEvent";
import { persistentFirebaseConnection } from "../firebaseService";
import { Option, Some, None } from "../../../../../model/patterns/option"

const storage = persistentFirebaseConnection.storageService;

/**
 * Utility method - replaces provided dateRange object with its default options
 * @param dateRange 
 * @returns 
 */
export function mergeDefaultDateRange(dateRange: FirebaseDateRange): FirebaseDateRange{
  return {
    startDate: dateRange?.startDate || 0,
    endDate: dateRange?.endDate || DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()
  }
}

// returning array format: [startTimestamp, endTimestamp, decompressedByteLength, metadata object]
export function parseStorageFileMetaData(rawMetaData: [any, any]) {
  const [metadata] = rawMetaData
  // removes directory and extension so that only file name is used
  const rawFileName = metadata.name.match(/(?<=\/)[^\/]+(?=\.\w+)/g)[0]
  // get file name from base64 encoding to utf-8
  const fileName = Buffer.from(rawFileName, "base64").toString()
  // format: startTimestamp;endTimestamp;decompressedByteLength
  const info = fileName.split(";").map(val => parseInt(val))
  logger.debug(info)
  return [...info, metadata]
}

/**
 * Utility method - Searching for all snapshots within date range
 * @param folderPath 
 * @param dateRange 
 * @param filter
 * @returns An array of objects retrieved from the storage
 */
export async function getSnapshotsFromDateRange(
  folderPath: string,
  dateRange: FirebaseDateRange,
  options?: {
    filter?: (json: IterableJson)=>IterableJson,
    downloadData?: boolean
  }
): Promise<Option<IterableJson[]>> {
  // get and filter out snapshots that match the given criteria
  const [files] = await storage.readFolderFromStorage(folderPath)
  if(!files) return None
  
  logger.debug(`There are ${files.length} in ${folderPath}`)
  const result = []
  options = options ?? { downloadData: true }

  for(const file of files){
    // get meta data and retrieve necessary information from them
    const [startDate, endDate, byteLength] = parseStorageFileMetaData(await file.getMetadata())
    if(endDate <= dateRange.startDate || startDate >= dateRange.endDate) continue;
    
    // decompress downloaded content with data extracted from above
    if(options.downloadData){
      const downloadContent = await file.download().then(res => res[0])
      const decompressedData = decompressData(downloadContent, byteLength).unwrapOr(null)
      decompressedData && result.push(options.filter ? options.filter(decompressedData) : decompressedData)
      continue
    }

    // placeholding data since there is no downloaded data
    result.push(Some(""))
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
export const customFlat = (
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
 * Generic method for uploading a snapshot
 * @param snapshot 
 * @param dateRange 
 * @param folder 
 */
export const uploadSnapshot = async (
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
export const deleteSnapshots = async (
  folderName: string,
  dateRange: FirebaseDateRange,
  publisher: PublisherImplementor<DatabaseEvent>
) => {
  dateRange = mergeDefaultDateRange(dateRange)
  const event = new DatabaseDeleteEvent({
    protected: {
      async storage(){
        const files = await getSnapshotsFromDateRange(folderName, dateRange, { downloadData: false })
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