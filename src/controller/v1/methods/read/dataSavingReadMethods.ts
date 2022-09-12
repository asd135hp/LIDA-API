import { apiPath } from "../../../../constants.config.json"
import { Get, Route, SuccessResponse, Response, Controller, Security, Query, Header, Path } from "tsoa";
import { logger } from "../../../../constants";
import { IterableJson } from "../../../../model/json";
import { getDateRangeString } from "../../../../utility/helper";
import DataSavingService from "../../services/firebaseFreetier/dataSavingService";
import { SnapshotDownloadResponse } from "../../../../model/v1/read/dataSaving";

@Security("api_key")
@Route(`api/v1/snapshot`)
@SuccessResponse(200, "Ok")
@Response("403", "Forbidden")
@Response("408", "Request Timeout")
export class DataSavingReadMethods extends Controller {
  // @Get("sensor/get")
  // async retrieveSensorSnapshots(
  //   @Query() accessToken: string,
  //   @Query() startDate?: number,
  //   @Query() endDate?: number
  // ): Promise<IterableJson[]> {
  //   const t = getDateRangeString({ startDate, endDate })
  //   logger.info(`DataSavingReadMethods: Getting all sensor snapshots in range from ${t.start} to ${t.end}`)
  //   const option = await new DataSavingService().retrieveSensorSnapshot({ startDate, endDate })
  //   return option.unwrapOr([])
  // }

  // @Route("actuator/snapshot")
  // @Get()
  // async retrieveActuatorSnapshot(
  //   @Query() startDate?: number,
  //   @Query() endDate?: number
  // ): Promise<IterableJson> {
  //   return await new DataSavingService().retrieveActuatorSnapshots({ startDate, endDate })
  // }

  // @Get("logs/get")
  // async retrieveLogSnapshots(
  //   @Query() accessToken: string,
  //   @Query() startDate?: number,
  //   @Query() endDate?: number
  // ): Promise<IterableJson[]> {
  //   const t = getDateRangeString({ startDate, endDate })
  //   logger.info(`DataSavingReadMethods: Getting all log snapshots in range from ${t.start} to ${t.end}`)
  //   const option = await new DataSavingService().retrieveLogSnapshot({ startDate, endDate })
  //   return option.unwrapOr([])
  // }
  
  @Get("sensor/{runNumber}/get")
  async retrieveSensorDataRunSnapshot(
    @Query() accessToken: string,
    @Path() runNumber: number
  ): Promise<SnapshotDownloadResponse[]> {
    logger.info(`DataSavingReadMethods: Getting run #${runNumber} sensor snapshot from the database`)
    const option = await new DataSavingService().retrieveSensorSnapshot(runNumber)
    return option.unwrapOrElse(()=>{
      this.setStatus(404)
      return []
    })
  }
}