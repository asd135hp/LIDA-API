import { DATABASE_TIMEZONE, logger, SENSOR_LIMIT } from "../../../../constants";
import { FirebaseDateRange } from "../../../../model/dateRange";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { PublisherImplementor } from "../../../../model/patterns/subscriptionImplementor";
import { SensorDTO, SensorDataDTO } from "../../../../model/v1/read/sensorDto";
import { Sensor, SensorData, UpdatingSensor } from "../../../../model/v1/write/sensors";
import DatabaseAddEvent from "../../../../model/v1/events/databaseAddEvent";
import DatabaseUpdateEvent from "../../../../model/v1/events/databaseUpdateEvent";
import { persistentFirebaseConnection } from "./firebaseService";
import { getQueryResultAsArray } from "../../../database/firebase/services/firebaseRealtimeService";
import { DateTime } from 'luxon'
import DataSavingService from "./dataSavingService";
import { Option, Some, None } from "../../../../model/patterns/option"
import { createWriteEvent, getRealtimeContent } from "../../../../utility/shorthandOps";

const realtime = persistentFirebaseConnection.realtimeService
const realtimeSensor = "sensors"
const realtimeSensorData = "sensorData"

const firestore = persistentFirebaseConnection.firestoreService
const firestoreSensor = "sensors"
const firestoreSensorData = "sensorData"

export default class SensorService {
  private publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  /**
   * Dumps all sensor details stored in the database
   * @returns All sensors in the database
   */
  async getSensors(): Promise<Option<SensorDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(realtimeSensor, null, { limitToFirst: SENSOR_LIMIT });

    logger.debug(`All sensors: ${result}`)
    return result.map(arr => {
      const newArr = arr.map((val: any) => SensorDTO.fromJson(val) as SensorDTO)
      return Some(newArr)
    })
  }

  /**
   * Get all sensor details by its designated type
   * @param type Type of sensor
   * @returns All sensor details with matched type
   */
  async getSensorsByType(type: string): Promise<Option<SensorDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(realtimeSensor, "type", { equalToValue: type });

    logger.debug(`Sensors by type: ${result}`)
    return result.map(arr => {
      const newArr = arr.map((val: any) => SensorDTO.fromJson(val) as SensorDTO)
      return Some(newArr)
    })
  }

  /**
   * Get a single sensor detail by name
   * @param name Name of the sensor, should be unique
   * @returns A single sensor detail with a matched name
   */
  async getSensorByName(name: string): Promise<Option<SensorDTO>> {
    let result: Option<any[]> = await getRealtimeContent(realtimeSensor, "name", { equalToValue: name });

    logger.debug(`Sensor by name: ${result}`)
    return result.map(arr => {
      const sensor = SensorDTO.fromJson(arr[0]) as SensorDTO
      return Some(sensor)
    })
  }

  /**
   * Get all sensor data by date range
   * @param dateRange Date range to limit how much data is downloaded
   * @returns All sensor data filtered by date range
   */
   async getSensorData(dateRange: FirebaseDateRange = {}): Promise<Option<SensorDataDTO[]>> {
    dateRange.startDate = dateRange.startDate || 0
    dateRange.endDate = dateRange.endDate || DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()

    const dataSavingService = new DataSavingService()
    let result: Option<any[]> = await dataSavingService.retrieveSensorDataFromSnapshots(dateRange);
    await realtime.getContent(realtimeSensorData, async ref => {
      // get result by filtration
      const temp = await getQueryResultAsArray(
        ref.orderByChild("timeStamp"),
        json => {
          const timestamp = json.timeStamp
          return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate
        })

      // concatenate saved data with new data while retaining its order
      const newResult = result.unwrapOr([]).concat(temp.unwrapOr([]))
      result = newResult.length == 0 ? None : Some(newResult)
    })

    logger.debug(`Sensor data by name: ${result}`)
    // converts all objects to DTO
    return result.map(data => {
      const arr = data.map(val => SensorDataDTO.fromJson(val) as SensorDataDTO)
      return Some(arr)
    })
  }

  /**
   * Get all sensor data by name and date range
   * @param name Name associated with sensor data
   * @param dateRange Date range to limit how much data is downloaded
   * @returns All sensor data filtered by name and date range
   */
  async getSensorDataByName(
    name: string,
    dateRange: FirebaseDateRange = {}
  ): Promise<Option<SensorDataDTO[]>> {
    dateRange.startDate = dateRange.startDate || 0
    dateRange.endDate = dateRange.endDate || DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()

    const dataSavingService = new DataSavingService()
    let result: Option<any[]> = await dataSavingService.retrieveSensorDataFromSnapshots(
      dateRange,
      json => json.sensorName == name
    );

    // does not return desired result
    await realtime.getContent(realtimeSensorData, async ref => {
      // get result by filtration
      const temp = await getQueryResultAsArray(
        ref.orderByChild("sensorName").equalTo(name),
        json => {
          const timestamp = json.timeStamp
          return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate
        })

      // concatenate saved data with new data while retaining its order
      const newResult = result.unwrapOr([]).concat(temp.unwrapOr([]))
      result = newResult.length == 0 ? None : Some(newResult)
    })

    logger.debug(`Sensor data by name: ${result}`)
    // converts all objects to DTO
    return result.map(data => {
      const arr = data.map(val => SensorDataDTO.fromJson(val) as SensorDataDTO)
      return Some(arr)
    })
  }

  /**
   * Add a single sensor to the database, this is cooperated with an anti-duping method
   * @param sensor Details about the sensor
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  async addSensor(sensor: Sensor): Promise<DatabaseEvent> {
    if(typeof(sensor.isRunning) === 'undefined') sensor.isRunning = true
    
    return await createWriteEvent({
      data: sensor,
      protectedMethods: {
        async write(){
          // check if the sensor exists within the database
          const result = await firestore.queryCollection(
            firestoreSensor,
            collectionRef => collectionRef.where("name", "==", sensor.name).get()
          )
          if(!result.empty){
            logger.error(`An sensor of the same name has already existed in the database: "${sensor.name}"`)
            return Promise.reject(`400An sensor with the same name "${sensor.name}" has already existed in the database`)
          }

          await firestore.addContentToCollection(firestoreSensor, sensor)
        },
        async read(){
          // check if the sensor exists in the database first before pushing it
          // since it will prevent ambiguity in later stages
          let result: Option<any[]> = await getRealtimeContent(realtimeSensor, "name", {
            equalToValue: sensor.name
          })

          if(result.match.isNone()) await realtime.pushContent(sensor, realtimeSensor)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 187"
    }, DatabaseAddEvent)
  }

  /**
   * Update a single sensor to the database
   * @param sensor Details about the sensor
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  async updateSensor(sensor: UpdatingSensor): Promise<DatabaseEvent> {
    return await createWriteEvent({
      data: sensor,
      protectedMethods: {
        async write(currentEvent: DatabaseEvent){
          // check if there is only one sensor with the same name exists in the database
          // first before updating the sensor
          const docs = (await firestore.queryCollection(
            firestoreSensor,
            collectionRef => collectionRef.where("name", "==", sensor.name).get()
          )).docs

          if(docs.length == 0)
            return Promise.reject("404Specified name does not match with anything in the database")

          if(docs.length > 1){
            currentEvent.content.warning = "Ambiguity: There are more than 2 sensors with the same name!"
            return Promise.reject("400Could not update sensor details due to ambiguity")
          }
          
          await firestore.updateDocument(docs[0].id, sensor)
        },
        async read(){
          await realtime.getContent(realtimeSensor, async ref => {
            let isValid = false
            let key = ""

            // check if this reference contains the sensor first before updating
            await ref.orderByChild("name").equalTo(sensor.name).once("child_added", child => {
              if(isValid = child.exists())
                key = child.key
            })
              
            if(isValid && key) {
              realtime.updateContent(sensor, `${realtimeSensor}/${key}`)
              return
            }

            Promise.reject(`404Could not find sensor named "${sensor.name}"`)
          })
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 239"
    }, DatabaseUpdateEvent)
  }

  /**
   * Add a single sensor data to the database
   * @param sensorData Data related to a sensor, related by name
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  async addSensorData(sensorName: string, sensorData: SensorData): Promise<DatabaseEvent> {
    return await createWriteEvent({
      data: { sensorName, ...sensorData },
      protectedMethods: {
        async write(){
          // check the existance of the sensor in the database first before adding new sensor data
          const result = await firestore.queryCollection(
            firestoreSensor,
            collectionRef => collectionRef.where("name", "==", sensorName).get()
          )

          if(result.empty)
            return Promise.reject("404Specified sensor name does not match with anything in the database")

          await firestore.addContentToCollection(firestoreSensorData, { sensorName, ...sensorData })
        },
        async read(){
          // check the existance of the sensor in the database first before adding new sensor data
          let result: Option<any[]> = await getRealtimeContent(realtimeSensor, "name", {
            equalToValue: sensorName
          })

          if(result.match.isNone())
            return Promise.reject(`404Could not find corresponding sensor name "${sensorName}"`)

          await realtime.pushContent({ sensorName, ...sensorData }, realtimeSensorData)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 194"
    }, DatabaseAddEvent)
  }
}