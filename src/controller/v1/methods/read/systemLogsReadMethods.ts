import { Get, Route, SuccessResponse, Response, Controller, Security, Path, Header, Query } from "tsoa";
import { logger } from "../../../../constants";
import { apiPath } from "../../../../constants.config.json"
import { LogDTO } from "../../../../model/v1/read/systemLogDto";
import LogsService from "../../services/firebaseFreetier/systemLogsService";

@Security("api_key")
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
}