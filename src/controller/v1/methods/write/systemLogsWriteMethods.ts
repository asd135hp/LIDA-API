import { Route, SuccessResponse, Response, Controller, Security, BodyProp, Post, Header, Query } from "tsoa";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import SystemLogsService from "../../services/firebaseFreetier/systemLogsService";
import { logger } from "../../../../constants";
import { apiPath } from "../../../../constants.config.json"
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent";

const getEvent = DatabaseEvent.getCompactEvent

// @Security("api_key")
@Route(`api/v1/log`)
@SuccessResponse(200, "Ok")
@Response(400, "Bad Request")
@Response(401, "Unauthorized")
@Response(403, "Forbidden")
@Response(404, "Not Found")
@Response(408, "Request Timeout")
export class SystemLogsWriteMethods extends Controller {
  static mainService: SystemLogsService;
  private service: SystemLogsService;

  constructor(){
    super()
    this.service = SystemLogsWriteMethods.mainService
  }
  
  @Post("sensor/add")
  async addSensorLog(
    @Query() accessToken: string,
    @BodyProp() logContent: string
  ): Promise<DatabaseEvent> {
    logger.info("SystemLogsWriteMethods: Adding sensor log to the database")
    
    const event = await this.service.addSensorLog({ logContent })
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }
    return getEvent(event)
  }

  @Post("actuator/add")
  async addActuatorLog(
    @Query() accessToken: string,
    @BodyProp() logContent: string
  ): Promise<DatabaseEvent> {
    logger.info("SystemLogsWriteMethods: Adding actuator log to the database")
    
    const event = await this.service.addActuatorLog({ logContent })
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }
    return getEvent(event)
  }
}