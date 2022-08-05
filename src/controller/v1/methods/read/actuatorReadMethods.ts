import { Get, Route, SuccessResponse, Response, Controller, Path, Security, Request, Header, Query } from "tsoa";
import { logger } from "../../../../constants";
import { ActuatorDTO, ActuatorCommandDTO } from "../../../../model/v1/read/actuatorDto";
import ActuatorService from "../../services/firebaseFreetier/actuatorService";

@Security("api_key")
@Route(`api/v1/actuator`)
@SuccessResponse(200, "Ok")
@Response(403, "Forbidden")
@Response(404, "Not Found")
@Response(408, "Request Timeout")
export class ActuatorReadMethods extends Controller {
  @Get("get")
  async getActuators(@Query() accessToken: string): Promise<ActuatorDTO[]> {
    logger.info("ActuatorReadMethods: Getting all actuators from the database")
    
    const option = await new ActuatorService().getActuators()
    return option.unwrapOrElse(()=>{
      // data is null here means that the database is failing to provide us information
      this.setStatus(408)
      return []
    })
  }

  @Get("{typeOrName}/get")
  async getCategorizedActuators(
    @Query() accessToken: string,
    @Path() typeOrName: string
  ): Promise<ActuatorDTO[]> {
    logger.info(`ActuatorReadMethods: Getting categorized actuators from the database "${typeOrName}"`)
    const actuatorService = new ActuatorService();
    
    const actuatorsByType = await actuatorService.getActuatorsByType(typeOrName)
    return await actuatorsByType.unwrapOrElseAsync(async ()=>{
      const actuatorByName = await actuatorService.getActuatorByName(typeOrName)
      return [actuatorByName.unwrapOrElse(()=>{
        this.setStatus(404)
        return null
      })].filter(x => x != null)
    })
  }

  @Get("command/all/get/{limitToFirst}")
  async getActuatorCommands(
    @Query() accessToken: string,
    @Path() limitToFirst?: number
  ): Promise<ActuatorCommandDTO[]> {
    logger.info("ActuatorReadMethods: Getting actuator commands from the database")

    const option = await new ActuatorService().getActuatorCommands(limitToFirst)
    return option.unwrapOrElse(()=>{
      // data is null here means that the database is failing to provide us information
      this.setStatus(408)
      return []
    })
  }

  @Get("command/oldest/get")
  async getOldestActuatorCommand(
    @Query() accessToken: string
  ): Promise<ActuatorCommandDTO | null> {
    logger.info("ActuatorReadMethods: Getting oldest actuator command from the database")

    const option = await new ActuatorService().getOldestActuatorCommand()
    return option.unwrapOrElse(()=>{
      // data is null here means that the database is failing to provide us information
      this.setStatus(408)
      return null
    })
  }
}