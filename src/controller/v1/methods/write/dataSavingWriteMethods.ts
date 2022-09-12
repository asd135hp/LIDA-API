import { Route, SuccessResponse, Response, Controller, Security, Query, Post, Path, Patch } from "tsoa";
import { logger } from "../../../../constants";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent";
import DataSavingService from "../../services/firebaseFreetier/dataSavingService";
import SensorService from "../../services/firebaseFreetier/sensorService";
import CounterService from "../../services/firebaseFreetier/counterService";

const getEvent = DatabaseEvent.getCompactEvent

@Security("api_key")
@Route(`api/v1/snapshot`)
@SuccessResponse(200, "Ok")
@Response(400, "Bad Request")
@Response(401, "Unauthorized")
@Response(403, "Forbidden")
@Response(404, "Not Found")
@Response(408, "Request Timeout")
export class DataSavingWriteMethods extends Controller {
  static mainService: DataSavingService;
  
  private service: DataSavingService;

  constructor(){
    super()
    this.service = DataSavingWriteMethods.mainService
  }

  // private get currentUnixTimestamp() { return DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger() }

  @Patch("sensor/{runNumber}/delete")
  async deleteSensorSnapshot(
    @Query() accessToken: string,
    @Path() runNumber: number
  ): Promise<DatabaseEvent> {

    // download content to a file
    // and then upload it to storage bucket
    const event = await this.service.deleteSensorSnapshot(runNumber)
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }

    return getEvent(event)
  }

  @Post("sensor/save")
  async saveSensorSnapshot(@Query() accessToken: string){
    logger.info(`DataSavingWriteMethods: Saving sensor snapshot to the storage`)

    // return appropriate status code from internal system
    const sensorService = new SensorService()
    const counterService = new CounterService()
    const snapshot = await sensorService.getSensorDataSnapshot()

    let event = await this.service.uploadSensorSnapshot({
      sensor: (await sensorService.getSensors()).unwrapOr([]),
      data: snapshot.unwrapOr([])
    }, await counterService.incrementSystemRunCounter())

    // prod code, no reason to delete data on test servers
    if(process.env.NODE_ENV === 'production'
    && !(event instanceof DatabaseErrorEvent)
    ){
      // delete data here, if there are problems with this, please remove it
      try{
        let count = 0
        while(count++ < 3){
          const deleteEvent = await sensorService.deleteSensorData()
          if(deleteEvent instanceof DatabaseErrorEvent){
            continue
          } else break;
        }
      } finally {
        // do not throw anything here since it will defo break the code
      }
    }

    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }
    return getEvent(event)
  }

  // @Post("log/save")
  // async saveLogSnapshot(
  //   @Query() accessToken: string,
  //   @Query() actuatorLogs: string,
  //   @Query() sensorLogs: string,
  //   @Query() startDate?: number,
  //   @Query() endDate?: number
  // ){
  //   const t = getDateRangeString({ startDate, endDate })
  //   logger.info(`DataSavingWriteMethods: Saving log snapshot to the storage from ${t.start} to ${t.end}`)
    
  //   // return appropriate status code from internal system
  //   const event = await this.service.uploadLogSnapshot({
  //     sensor: JSON.parse(sensorLogs),
  //     actuator: JSON.parse(actuatorLogs)
  //   }, { startDate, endDate })
    
  //   if(event instanceof DatabaseErrorEvent){
  //     this.setStatus(event.content.values.statusCode)
  //   }
  //   return getEvent(event)
  // }

  // @Post("sensor/save/daily")
  // async saveDailySensorSnapshot(
  //   @Query() accessToken: string
  // ): Promise<DatabaseEvent> {
  //   logger.info("DataSavingWriteMethods: Saving daily sensor snapshot to the storage")
    
  //   // return appropriate status code from internal system
  //   const now = this.currentUnixTimestamp
  //   const dateRange = { startDate: now - 3600 * 24, endDate: now }
  //   const event = await this.service.uploadSensorSnapshot({
  //     sensor: await firestore.getCollection("sensors").then(result => result.docs.map(doc => doc.data())),
  //     sensorData: await firestore.getCollection("sensorData").then(result => result.docs.map(doc => doc.data()))
  //   }, dateRange)

  //   if(event instanceof DatabaseErrorEvent){
  //     this.setStatus(event.content.values.statusCode)
  //   } else {
  //     // delete data to save space
  //     await (firestore as FirebaseFirestoreService).deleteCollection("sensorData")
  //     await realtime.deleteContent("sensorData")
  //   }

  //   return getEvent(event)
  // }

  // @Post("log/save/daily")
  // async saveDailyLogSnapshot(
  //   @Query() accessToken: string
  // ): Promise<DatabaseEvent> {
  //   logger.info("DataSavingWriteMethods: Saving daily logs snapshot to the storage")
    
  //   // return appropriate status code from internal system
  //   const now = this.currentUnixTimestamp
  //   const dateRange = { startDate: now - 3600 * 24, endDate: now }
  //   const event = await this.service.uploadLogSnapshot({
  //     sensor: await firestore.getCollection("logs/sensor").then(result => result.docs.map(doc => doc.data())),
  //     actuator: await firestore.getCollection("logs/actuator").then(result => result.docs.map(doc => doc.data()))
  //   }, dateRange)

  //   if(event instanceof DatabaseErrorEvent){
  //     this.setStatus(event.content.values.statusCode)
  //   } else {
  //     // delete content to save space
  //     await firestore.deleteDocument("logs")
  //     await realtime.deleteContent("logs")
  //   }

  //   return getEvent(event)
  // }

  // @Delete("sensor/delete")
  // async deleteSensorSnapshots(
  //   @Query() accessToken: string,
  //   @Query() startDate?: number,
  //   @Query() endDate?: number
  // ): Promise<DatabaseEvent> {
  //   const t = getDateRangeString({ startDate, endDate })
  //   logger.info(`DataSavingWriteMethods: Deleting sensor snapshot from the storage from ${t.start} to ${t.end}`)
    
  //   // return appropriate status code from internal system
  //   const event = await this.service.deleteSensorSnapshots({ startDate, endDate })
  //   if(event instanceof DatabaseErrorEvent){
  //     this.setStatus(event.content.values.statusCode)
  //   }

  //   return getEvent(event)
  // }

  // @Delete("sensor/{runNumber}/delete")
  // async deleteSensorSnapshot(
  //   @Query() accessToken: string,
  //   @Path() runNumber: number
  // ): Promise<DatabaseEvent> {
  //   const event = await this.service.deleteSensorSnapshot(runNumber)
  //   if(event instanceof DatabaseErrorEvent){
  //     this.setStatus(event.content.values.statusCode)
  //   }

  //   return getEvent(event)
  // }

  // @Delete("log/delete")
  // async deleteLogSnapshots(
  //   @Query() accessToken: string,
  //   @Query() startDate?: number,
  //   @Query() endDate?: number
  // ): Promise<DatabaseEvent> {
  //   const t = getDateRangeString({ startDate, endDate })
  //   logger.info(`DataSavingWriteMethods: Deleting log snapshots from the storage from ${t.start} to ${t.end}`)
    
  //   // return appropriate status code from internal system
  //   const event = await this.service.deleteLogSnapshots({ startDate, endDate })
  //   if(event instanceof DatabaseErrorEvent){
  //     this.setStatus(event.content.values.statusCode)
  //   }

  //   return getEvent(event)
  // }
}