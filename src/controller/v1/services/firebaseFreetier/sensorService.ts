import { DATABASE_TIMEZONE, logger, SENSOR_LIMIT } from "../../../../constants";
import { FirebaseDateRange } from "../../../../model/dateRange";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { SensorDTO, SensorDataDTO } from "../../../../model/v1/read/sensorDto";
import { DatabaseSensorData, Sensor, SensorData, UpdatingSensor } from "../../../../model/v1/write/sensors";
import DatabaseAddEvent from "../../../../model/v1/events/databaseAddEvent";
import DatabaseUpdateEvent from "../../../../model/v1/events/databaseUpdateEvent";
import { persistentFirebaseConnection } from "./firebaseService";
import { getQueryResultAsArray } from "../../../database/firebase/services/firebaseRealtimeService";
import { DateTime } from 'luxon'
import { Option, Some, None } from "../../../../model/patterns/option"
import { createWriteEvent, getRealtimeContent } from "../../../../utility/firebase/shorthandOps";
import { COMPONENTS_PATH as fbPath } from "../../../../constants";
import { orderByProp } from "../../../../utility/helper";
import FirebaseFirestoreService from "../../../database/firebase/services/firebaseFirestoreService";
import DatabaseDeleteEvent from "../../../../model/v1/events/databaseDeleteEvent";
import { CQRSError } from "../../../../model/v1/error";
import { SensorServiceFacade } from "../../../../model/v1/services/sensorServiceFacade";
import { convertTimeStampToSeconds } from "../../../../utility/convertTimestamp";

const realtime = persistentFirebaseConnection.realtimeService
const firestore = persistentFirebaseConnection.firestoreService

export default class SensorService extends SensorServiceFacade {
  async getSensors(): Promise<Option<SensorDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(fbPath.sensor, null, { limitToFirst: SENSOR_LIMIT });

    logger.debug(`All sensors: ${result}`)
    return result.map(arr => {
      const newArr = arr.map((val: any) => SensorDTO.fromJson(val) as SensorDTO)
      return Some(newArr)
    })
  }

  async getSensorsByType(type: string): Promise<Option<SensorDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(fbPath.sensor, "type", { equalToValue: type });

    logger.debug(`Sensors by type: ${result}`)
    return result.map(arr => {
      const newArr = arr.map((val: any) => SensorDTO.fromJson(val) as SensorDTO)
      return Some(newArr)
    })
  }

  async getSensorByName(name: string): Promise<Option<SensorDTO>> {
    let result: Option<any[]> = await getRealtimeContent(fbPath.sensor, "name", { equalToValue: name });

    logger.debug(`Sensor by name: ${result}`)
    return result.map(arr => {
      const sensor = SensorDTO.fromJson(arr[0]) as SensorDTO
      return Some(sensor)
    })
  }

  async getSensorData(dateRange: FirebaseDateRange = {}): Promise<Option<SensorDataDTO[]>> {
    dateRange.startDate = dateRange.startDate || 0
    dateRange.endDate = dateRange.endDate || DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()

    let result: Option<any[]> = None
    await realtime.getContent(fbPath.sensorData, async ref => {
      // get result by filtration
      result = await getQueryResultAsArray(
        ref.orderByKey(),
        json => {
          const timestamp = json.timeStamp
          logger.debug("Get sensor data - timeStamp: " + json.timeStamp)
          return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate
        })
    })

    logger.debug(`Sensor data by name: ${result}`)
    // converts all objects to DTO
    return result.map(data => {
      const arr = data.map(val => SensorDataDTO.fromJson(val) as SensorDataDTO).sort(orderByProp("timeStamp", false))
      return Some(arr)
    })
  }

  async getSensorDataByName(
    name: string,
    dateRange: FirebaseDateRange = {}
  ): Promise<Option<SensorDataDTO[]>> {
    dateRange.startDate = dateRange.startDate || 0
    dateRange.endDate = dateRange.endDate || DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()

    let result: Option<any[]> = None
    await realtime.getContent(fbPath.sensorData, async ref => {
      // get result by filtration
      result = await getQueryResultAsArray(
        ref.orderByChild("sensorName").equalTo(name),
        json => {
          const timestamp = json.timeStamp
          return timestamp >= dateRange.startDate && timestamp <= dateRange.endDate
        })
    })

    logger.debug(`Sensor data by name: ${result}`)
    // converts all objects to DTO
    return result.map(data => {
      const arr = data.map(val => SensorDataDTO.fromJson(val) as SensorDataDTO).sort(orderByProp("timeStamp", false))
      return Some(arr)
    })
  }

  async getSensorDataSnapshot(dateRange: FirebaseDateRange = {}): Promise<Option<SensorData[][]>> {
    dateRange = {
      startDate: dateRange.startDate || 0,
      endDate: dateRange.endDate || DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()
    }

    const cachedEndDate = DateTime.fromSeconds(dateRange.endDate)
    const boundTimeObj = DateTime.local(cachedEndDate.year, cachedEndDate.month, cachedEndDate.day + 1).setZone(DATABASE_TIMEZONE)

    let currentDayCount = 1
    let [upperBoundTime, lowerBoundTime] = [
      boundTimeObj.toUnixInteger(),
      boundTimeObj.minus({ day: currentDayCount++ }).toUnixInteger()
    ]
    let result: SensorData[][] = [[]]
    await realtime.getContent(fbPath.sensorData, async ref => {
      // get result bu filtration
      await ref.orderByChild("timeStamp").once('value', snapshot => {
        if(!snapshot.exists()){
          logger.warn("Snapshot does not exist with a value of " + snapshot.val())
          return
        }

        snapshot.forEach(child => {
          const json = child.val()
          const timestamp = json.timeStamp
          if(timestamp <= upperBoundTime) {
            if(timestamp < lowerBoundTime) {
              // if the lower bound of current time range is indefinitely lower than what is specified,
              // do not do anything
              if(lowerBoundTime < dateRange.startDate) return

              // set time boundaries whenever the timestamp value is less trhan the current day
              [upperBoundTime, lowerBoundTime] = [
                lowerBoundTime, 
                boundTimeObj.minus({ day: currentDayCount++ }).toUnixInteger()
              ]

              // else add a new array, indicating a storage for new day
              result.push([json])
              return
            }

            // add json data to the current day storage to the final array sinceit is the latest
            // this is not supposed to be interfered by lowerBoundTime < dateRange.startDate
            result.at(-1).push(json)
          }
        })
      })
    })

    logger.debug(`SensorData by date: ${result}`)
    return !result.length ? None : Some(result.reverse())
  }

  async getLatestSensorData(): Promise<Option<SensorDataDTO[]>>{
    let result: SensorDataDTO[] = []
    
    // get result by filtration
    const sensorNames = await this.getSensors()
    if(sensorNames.match.isNone()) return;

    // iter though each sensor name and get the most recent data from the database
    // no need to be afraid of rate limiting since realtime database limits how
    // much is downloaded instead
    for(const sensor of sensorNames.unwrapOr([])) {
      const data = await this.getLatestSensorDataByName(sensor.name)
      if(data.match.isOk()) {
        // null will never be used
        result.push(data.unwrapOr(null))
      }
    }

    logger.debug(`Sensor data by Name: ${result}`)
    return result.length ? Some(result) : None
  }

  async getLatestSensorDataByName(name: string): Promise<Option<SensorDataDTO>>{
    let result: Option<SensorDataDTO> = None
    await realtime.getContent(fbPath.sensorData, async ref => {
      // get only the most recent result by filtration
      const temp = await getQueryResultAsArray(ref.orderByChild("sensorName").equalTo(name).limitToFirst(1))
      result = temp.map(arr => !arr[0] ? None : Some(arr[0]))
    })

    logger.debug(`Latest sensor data by name: ${result.unwrapOr(null)}`)
    return result
  }

  async addSensor(sensor: Sensor): Promise<DatabaseEvent> {
    if(typeof(sensor.isRunning) === 'undefined') sensor.isRunning = true
    
    return await createWriteEvent({
      data: sensor,
      protectedMethods: {
        async write(){
          // check if the sensor exists within the database
          const result = await firestore.queryCollection(
            fbPath.sensor,
            collectionRef => collectionRef.where("name", "==", sensor.name).get()
          )
          if(!result.empty){
            logger.error(`An sensor of the same name has already existed in the database: "${sensor.name}"`)
            return Promise.reject(`400An sensor with the same name "${sensor.name}" has already existed in the database`)
          }

          await firestore.addContentToCollection(fbPath.sensor, sensor)
        },
        async read(){
          // check if the sensor exists in the database first before pushing it
          // since it will prevent ambiguity in later stages
          let result: Option<any[]> = await getRealtimeContent(fbPath.sensor, "name", {
            equalToValue: sensor.name
          })

          if(result.match.isNone()) await realtime.pushContent(sensor, fbPath.sensor)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 266"
    }, DatabaseAddEvent)
  }

  async updateSensor(sensor: UpdatingSensor): Promise<DatabaseEvent> {
    return await createWriteEvent({
      data: sensor,
      protectedMethods: {
        async write(currentEvent: DatabaseEvent){
          // check if there is only one sensor with the same name exists in the database
          // first before updating the sensor
          const docs = (await firestore.queryCollection(
            fbPath.sensor,
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
          await realtime.getContent(fbPath.sensor, async ref => {
            let isValid = false
            let key = ""

            // check if this reference contains the sensor first before updating
            await ref.orderByChild("name").equalTo(sensor.name).once("child_added", child => {
              if(isValid = child.exists())
                key = child.key
            })
              
            if(isValid && key) {
              realtime.updateContent(sensor, `${fbPath.sensor}/${key}`)
              return
            }

            Promise.reject(`404Could not find sensor named "${sensor.name}"`)
          })
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 275"
    }, DatabaseUpdateEvent)
  }

  async addSensorData(sensorName: string, sensorData: SensorData): Promise<DatabaseEvent> {
    sensorData.timeStamp = convertTimeStampToSeconds(sensorData.timeStamp)
    return await createWriteEvent({
      data: { sensorName, ...sensorData },
      protectedMethods: {
        async write(){
          // check the existance of the sensor in the database first before adding new sensor data
          const result = await firestore.queryCollection(
            fbPath.sensor,
            collectionRef => collectionRef.where("name", "==", sensorName).get()
          )

          if(result.empty)
            return Promise.reject("404Specified sensor name does not match with anything in the database")

          await firestore.addContentToCollection(fbPath.sensorData, { sensorName, ...sensorData })
        },
        async read(){
          // check the existance of the sensor in the database first before adding new sensor data
          let result: Option<any[]> = await getRealtimeContent(fbPath.sensor, "name", {
            equalToValue: sensorName
          })

          if(result.match.isNone())
            return Promise.reject(`404Could not find corresponding sensor name "${sensorName}"`)

          await realtime.pushContent({ sensorName, ...sensorData }, fbPath.sensorData)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 356"
    }, DatabaseAddEvent)
  }

  async addSensorDataByBundle(sensorData: DatabaseSensorData[]): Promise<DatabaseEvent> {
    sensorData = sensorData.map(data => ({ ...data, timeStamp: convertTimeStampToSeconds(data.timeStamp) }))
    return await createWriteEvent({
      data: { numberOfSensorData: sensorData.length },
      protectedMethods: {
        async write(){
          let error = 0
          for(const data of sensorData) {
            // check the existance of the sensor in the database first before adding new sensor data
            const result = await firestore.queryCollection(
              fbPath.sensor,
              collectionRef => collectionRef.where("name", "==", data.sensorName).get()
            )

            if(result.empty) {
              error++
              continue
            }

            await firestore.addContentToCollection(fbPath.sensorData, data)
          }

          // some data is added to the database so it might not necessarily be an error
          if(error > 0) return Promise.reject(
            {
              message: `There ${error > 1 ? "are" : "is"} ${error} sensor data for sensor names that are not registered in the database`,
              statusCode: 404,
              ignore: error !== sensorData.length,
              eventWhenIgnored: new DatabaseEvent({
                info: `${sensorData.length - error} sensor data is added to the database`,
                error: `${error} sensor data could not be added due to using sensor names that are not already in the database`,
                warning: "Some sensor data is added to the database but not all of them",
                type: "Ok"
              })
            } as CQRSError
          )
        },
        async read(){
          // check the existance of the sensor in the database first before adding new sensor data
          let error = 0
          
          for(const data of sensorData){
            let result: Option<any[]> = await getRealtimeContent(fbPath.sensor, "name", {
              equalToValue: data.sensorName
            })

            if(result.match.isNone()){
              error++
              continue
            }

            await realtime.pushContent(data, fbPath.sensorData)
          }

          // some data is added to the database so it might not necessarily be an error
          if(error > 0) return Promise.reject(
            {
              message: `There ${error > 1 ? "are" : "is"} ${error} sensor data for sensor names that are not registered in the database`,
              statusCode: 404,
              ignore: error !== sensorData.length,
              eventWhenIgnored: new DatabaseEvent({
                info: `${sensorData.length - error} sensor data is added to the database`,
                error: `${error} sensor data could not be added due to using sensor names that are not already in the database`,
                warning: "Some sensor data is added to the database but not all of them",
                type: "Ok"
              })
            } as CQRSError
          )
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 436"
    }, DatabaseAddEvent)
  }

  async deleteSensorData(): Promise<DatabaseEvent> {
    return await createWriteEvent({
      data: {},
      protectedMethods: {
        async write(){
          // really dangerous so it is not recommended for normal usage
          await (firestore as FirebaseFirestoreService).deleteCollection(fbPath.sensorData)
        },
        async read(){
          // really dangerous so it is not recommended for normal usage
          await realtime.deleteContent(fbPath.sensorData)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SensorService: DatabaseEvent filtration leads to all error ~ 194"
    }, DatabaseDeleteEvent)
  }
}