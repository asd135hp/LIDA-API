import { DateTime } from "luxon";
import { Get, Route, SuccessResponse, Response, Controller, Path, Security, Query, Header } from "tsoa";
import { DATABASE_TIMEZONE, logger } from "../../../../constants";
import { apiPath } from "../../../../constants.config.json"
import { SnapshotDownloadResponse } from "../../../../model/v1/read/dataSaving";
import { SensorDTO, SensorDataDTO } from "../../../../model/v1/read/sensorDto";
import DataSavingService from "../../services/firebaseFreetier/dataSavingService";
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

  @Get("data/fetchAll")
  async getSensorData(
    @Query() accessToken: string,
    @Query() startDate: number = 0,
    @Query() endDate: number = DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()
  ): Promise<SensorDataDTO[]> {
    logger.info(`SensorReadMethods: Getting sensor data from the database from ${startDate} to ${endDate}`)

    const option = await new SensorService().getSensorData({ startDate, endDate })
    return option.unwrapOrElse(()=>{
      // handle status code when the entity is not found in the database
      this.setStatus(404)
      return []
    })
  }

  @Get("{name}/data/get")
  async getSensorDataByName(
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

  @Get("data/latest/get")
  async getLatestSensorData(
    @Query() accessToken: string
  ): Promise<SensorDataDTO[]> {
    logger.info(`SensorReadMethods: Getting all latest sensor data from the database`)

    const option = await new SensorService().getLatestSensorData()
    return option.unwrapOrElse(()=>{
      // handle status code when the entity is not found in the database
      this.setStatus(404)
      return []
    })
  }

  @Get("{name}/data/latest/get")
  async getLatestSensorDataByName(
    @Query() accessToken: string,
    @Path() name: string
  ): Promise<SensorDataDTO> {
    logger.info(`SensorReadMethods: Getting latest sensor data from the database with sensor name of "${name}"`)

    const option = await new SensorService().getLatestSensorDataByName(name)
    return option.unwrapOrElse(()=>{
      // handle status code when the entity is not found in the database
      this.setStatus(404)
      return SensorDataDTO.fromJson({}) as SensorDataDTO
    })
  }

  @Get("snapshot/{runNumber}/get")
  async getSensorDataRunSnapshot(
    @Query() accessToken: string,
    @Path() runNumber: number
  ): Promise<SnapshotDownloadResponse[]> {
    logger.info(`SensorReadMethods: Getting sensor data of the previous run#${runNumber} from the database`)
    
    const option = await new DataSavingService().retrieveSensorSnapshot(runNumber)
    return option.unwrapOrElse(()=>{
      // handle status code when the entity is not found in the database
      this.setStatus(404)
      return []
    })
  }
}