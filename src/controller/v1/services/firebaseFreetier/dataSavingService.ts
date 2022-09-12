import { logger } from "../../../../constants";
import { FirebaseDateRange } from "../../../../model/dateRange";
import { IterableJson } from "../../../../model/json";
import { PublisherImplementor } from "../../../../model/patterns/subscriptionImplementor";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { persistentFirebaseConnection } from "./firebaseService";
import DatabaseCreateEvent from "../../../../model/v1/events/databaseCreateEvent";
import { filterDatabaseEvent } from "../../../../utility/filterDatabaseEvent";
import { orderByProp } from "../../../../utility/helper";
import { Option, Some, None } from "../../../../model/patterns/option"
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent";
import { SnapshotDownloadResponse } from "../../../../model/v1/read/dataSaving";
import { COMPONENTS_PATH as fbPath } from "../../../../constants";
import {
  parseStorageFileMetaData, mergeDefaultDateRange, getSnapshotsFromDateRange,
  customFlat, uploadSnapshot, deleteSnapshots, SensorSnapshot
} from "./utility/dataSavingService";
import { DateTime } from "luxon";
import { strToU8, zip } from "fflate";

const storage = persistentFirebaseConnection.storageService;

export default class DataSavingService {
  private publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  /**
   * Retrive sensor snapshots in chunks by date
   * @param runNumber Run number that is associated with that snapshot
   * @returns None on an empty array, otherwise Some
   */
  async retrieveSensorSnapshot(runNumber: number): Promise<Option<SnapshotDownloadResponse[]>> {
    const folderPath = `${fbPath.storage.sensor}/run${runNumber}`
    const response = await storage.readFolderFromStorage(folderPath)
    if(!response) return None
    
    // extract files from the response
    const [files] = response
    if(!files.length) return None

    logger.debug(`There are ${files.length} in ${folderPath}`)
    const result = []
    for(const file of files){
      const [startDate, endDate, byteLength] = parseStorageFileMetaData(await file.getMetadata());
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: DateTime.now().toUnixInteger() + 3600 * 24,
      });
      
      result.push({
        newFileName: `${startDate}_${endDate}_run${runNumber}.zip`,
        downloadUrl: signedUrl,
        startDate, endDate,
        decompressionByteLength: byteLength,
        note: "The download link will expire today"
      })
    }

    return Some(result)
  }

  /**
   * More performant log snapshots retrieval method since it will only apply filter only on sensor logs
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  async retrieveSensorLogSnapshots(dateRange?: FirebaseDateRange): Promise<Option<IterableJson[]>> {
    dateRange = mergeDefaultDateRange(dateRange)
    // get ready to merge multiple snapshots together
    const data = await getSnapshotsFromDateRange(`${fbPath.storage.log}/sensor`, dateRange)
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
    const data = await getSnapshotsFromDateRange(`${fbPath.storage.log}/actuator`, dateRange)
    return customFlat(data, dateRange)
  }

  /**
   * More performant log snapshots retrieval method since it will only apply filter only on system command logs
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  async retrieveSystemCommandLogSnapshots(dateRange?: FirebaseDateRange): Promise<Option<IterableJson[]>> {
    dateRange = mergeDefaultDateRange(dateRange)
    // get ready to merge multiple snapshots together
    const data = await getSnapshotsFromDateRange(`${fbPath.storage.log}/systemCommand`, dateRange)
    return customFlat(data, dateRange)
  }

  /**
   * Upload what is considered to be a snapshot of sensor data in a period of time to a sensor folder on the server
   * @param snapshots 
   * @param runNumber
   * @returns 
   */
  async uploadSensorSnapshot(snapshots: SensorSnapshot, runNumber: number): Promise<DatabaseEvent> {
    const folderName = `${fbPath.storage.sensor}/run${runNumber}`
    const sensorName = snapshots.sensor.sort(orderByProp("name"))
    const sensorData = new Object()

    snapshots.data.map((obj, systemDay) => {
      Object.assign(sensorData, {
        [`day#${systemDay}`]: obj
      })
    })

    // upload zipped snapshot to the database
    const event = new DatabaseCreateEvent({
      protected:{
        async storage(){
          //mock this -jest test
          let buffer: Buffer = null
          
          zip({
            "sensor_names_and_statuses": [strToU8(JSON.stringify(sensorName)), {}],
            "sensor_data": [strToU8(JSON.stringify(sensorData)), {}]
          }, { level: 9 }, (err, data) => {
            if(err) throw err
            buffer =  Buffer.from(data)
            storage.uploadBytesToStorage(`${folderName}/${buffer.byteLength}`, buffer).then(()=>{
              logger.debug("It worked ~ DataSavingService.ts line 128")
            }, (reason: any)=>{
              logger.error(`Error: ${reason} ~ DataSavingService.ts line 130`)
            })
          })
        }
      }
    })

    return filterDatabaseEvent(await this.publisher.notifyAsync(event)).unwrapOrElse(()=>{
      logger.error("DataSavingService: DatabaseEvent filtration leads to all error ~ 119")
      return new DatabaseErrorEvent("The action is failed to be executed", 400)
    })
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
      actuator: snapshot.actuator.sort(orderByProp("timeStamp")),
      systemCommand: snapshot.systemCommand.sort(orderByProp("timeStamp"))
    }
    
    return filterDatabaseEvent([
      await uploadSnapshot(snapshot.sensor, dateRange, `${fbPath.storage.log}/sensor`, this.publisher, 282),
      await uploadSnapshot(snapshot.actuator, dateRange, `${fbPath.storage.log}/actuator`, this.publisher, 283),
      await uploadSnapshot(snapshot.systemCommand, dateRange, `${fbPath.storage.log}/systemCommand`, this.publisher, 284),
    ], DatabaseCreateEvent).unwrapOr(new DatabaseErrorEvent("Could not retrieve saved log snapshots", 404))
  }

  /**
   * Delete sensor snapshot of a specific run number
   * @param runNumber 
   * @returns 
   */
  async deleteSensorSnapshot(runNumber: number): Promise<DatabaseEvent> {
    return await deleteSnapshots(
      `${fbPath.storage.sensor}/run${runNumber}`,
      mergeDefaultDateRange({}),
      this.publisher
    )
  }

  /**
   * Delete log snapshots of a specific date range - not functional
   * @param runNumber 
   * @returns 
   */
  async deleteLogSnapshots(dateRange: FirebaseDateRange): Promise<DatabaseEvent> {
    return await deleteSnapshots(fbPath.storage.log, dateRange, this.publisher)
  }
}