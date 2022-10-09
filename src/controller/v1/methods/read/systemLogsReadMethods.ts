import { Get, Route, SuccessResponse, Response, Controller, Security, Query } from "tsoa";
import { defaultKeySchema, logger } from "../../../../constants";
import { LogDTO } from "../../../../model/v1/read/systemLogDto";
import LogsService from "../../services/firebaseFreetier/systemLogsService";

@Security(defaultKeySchema)
@Route(`api/v1/log`)
@SuccessResponse(200, "Ok")
@Response("403", "Forbidden")
@Response("408", "Request Timeout")
export class SystemLogsReadMethods extends Controller {
  @Get("sensor/get")
  async getSensorLogs(@Query() accessToken: string): Promise<LogDTO[]> {
    logger.info("SystemLogsReadMethods: Getting sensor logs from the database")
    return (await new LogsService().getSensorLogs()).unwrapOrElse(()=>{
      this.setStatus(408)
      return []
    })
  }

  @Get("actuator/get")
  async getActuatorLogs(@Query() accessToken: string): Promise<LogDTO[]> {
    logger.info("SystemLogsReadMethods: Getting actuator logs from the database")
    return (await new LogsService().getActuatorLogs()).unwrapOrElse(()=>{
      this.setStatus(408)
      return []
    })
  }

  @Get("systemCommand/get")
  async getSystemCommandLogs(@Query() accessToken: string): Promise<LogDTO[]> {
    logger.info("SystemLogsReadMethods: Getting system command logs from the database")
    return (await new LogsService().getSystemCommandLogs()).unwrapOrElse(()=>{
      this.setStatus(408)
      return []
    })
  }
}