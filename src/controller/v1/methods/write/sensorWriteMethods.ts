import { Post, Patch, Route, SuccessResponse, Response, Controller, Security, BodyProp, Path, Header, Query } from "tsoa";
import { logger } from "../../../../constants";
import { apiPath } from "../../../../constants.config.json"
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { Sensor, SensorData, UpdatingSensor } from "../../../../model/v1/write/sensors";
import SensorService from "../../services/firebaseFreetier/sensorService";
import SystemLogsService from "../../services/firebaseFreetier/systemLogsService";
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent";

const getEvent = DatabaseEvent.getCompactEvent

@Security("api_key")
@Route(`api/v1/sensor`)
@SuccessResponse(200, "Ok")
@Response(400, "Bad Request")
@Response(401, "Unauthorized")
@Response(403, "Forbidden")
@Response(404, "Not Found")
@Response(408, "Request Timeout")
export class SensorWriteMethods extends Controller {
  static mainService: SensorService;
  
  private service: SensorService;
  private logger: SystemLogsService;

  constructor(){
    super()
    this.service = SensorWriteMethods.mainService
  }

  @Post("add")
  async addSensor(
    @Query() accessToken: string,
    @BodyProp() sensor: Sensor
  ): Promise<DatabaseEvent> {
    logger.info(`SensorWriteMethods: Adding sensor "${sensor.name}" to the database`)
    
    // return appropriate status code from internal system
    const event = await this.service.addSensor(sensor)
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }

    return getEvent(event)
  }

  @Patch("update")
  async updateSensor(
    @Query() accessToken: string,
    @BodyProp() sensor: UpdatingSensor
  ): Promise<DatabaseEvent> {
    logger.info(`SensorWriteMethods: Updating sensor "${sensor.name}" in the database`)

    // return appropriate status code from internal system
    const event = await this.service.updateSensor(sensor)
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }

    return getEvent(event)
  }
  
  @Post("{sensorName}/data/add")
  async addSensorData(
    @Query() accessToken: string,
    @Path() sensorName: string,
    @BodyProp() sensorData: SensorData): Promise<DatabaseEvent>
  {
    logger.info(`SensorWriteMethods: Adding sensor data with sensor name "${sensorName}" to the database`)

    // return appropriate status code from internal system
    const event = await this.service.addSensorData(sensorName, sensorData)
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }

    return getEvent(event)
  }
}