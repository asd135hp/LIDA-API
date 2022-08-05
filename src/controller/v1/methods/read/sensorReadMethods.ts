import { DateTime } from "luxon";
import { Get, Route, SuccessResponse, Response, Controller, Path, Security, Query, Header } from "tsoa";
import { DATABASE_TIMEZONE, logger } from "../../../../constants";
import { apiPath } from "../../../../constants.config.json"
import { SensorDTO, SensorDataDTO } from "../../../../model/v1/read/sensorDto";
import SensorService from "../../services/firebaseFreetier/sensorService";

@Security("api_key")
@Route(`api/v1/sensor`)
@SuccessResponse(200, "Ok")
@Response(403, "Forbidden")
@Response(404, "Not Found")
@Response(408, "Request Timeout")
export class SensorReadMethods extends Controller {
  @Get("get")
  async getSensors(@Query() accessToken: string): Promise<SensorDTO[]> {
    logger.info("SensorReadMethods: Getting all sensors from the database")
    const option = await new SensorService().getSensors()
    return option.unwrapOr([])
  }

  @Get("{typeOrName}/get")
  async getCategorizedSensors(
    @Query() accessToken: string,
    @Path() typeOrName: string
  ): Promise<SensorDTO[]> {
    logger.info(`SensorReadMethods: Getting categorized sensors from "${typeOrName}"`)
    
    const sensorService = new SensorService();
    const sensorsByType = await sensorService.getSensorsByType(typeOrName)
    return await sensorsByType.unwrapOrElseAsync(async ()=>{
      const sensorByName = await sensorService.getSensorByName(typeOrName)
      return [sensorByName.unwrapOrElse(()=>{
        this.setStatus(404)
        return null
      })].filter(x => x != null)
    })
  }

  @Get("{name}/data/get")
  async getSensorData(
    @Query() accessToken: string,
    @Path() name: string,
    @Query() startDate: number = 0,
    @Query() endDate: number = DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()
  ): Promise<SensorDataDTO[]> {
    logger.info(`SensorReadMethods: Getting sensor data from the database with sensor name of "${name}"`)

    const option = await new SensorService().getSensorDataByName(name, { startDate, endDate })
    return option.unwrapOrElse(()=>{
      // handle status code when the entity is not found in the database
      this.setStatus(404)
      return []
    })
  }
}