import { Route, SuccessResponse, Response, Controller, Security, BodyProp, Post, Query } from "tsoa";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { SystemLogsService } from "../../services/serviceEntries";
import { defaultKeySchema, logger } from "../../../../constants";
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent";

const getEvent = DatabaseEvent.getCompactEvent

@Security(defaultKeySchema)
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

  @Post("systemCommand/add")
  async addSystemCommandLog(
    @Query() accessToken: string,
    @BodyProp() logContent: string
  ): Promise<DatabaseEvent> {
    logger.info("SystemLogsWriteMethods: Adding system command log to the database")
    
    const event = await this.service.addSystemCommandLog({ logContent })
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }
    return getEvent(event)
  }
}