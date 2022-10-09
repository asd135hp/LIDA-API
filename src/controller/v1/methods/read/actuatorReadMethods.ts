import { Get, Route, SuccessResponse, Response, Controller, Path, Security, Query } from "tsoa";
import { defaultKeySchema, logger } from "../../../../constants";
import { ActuatorDTO, ActuatorConfigDTO } from "../../../../model/v1/read/actuatorDto";
import ActuatorService from "../../services/firebaseFreetier/actuatorService";

@Security(defaultKeySchema)
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

  @Get("config/get")
  async getActuatorConfigs(@Query() accessToken: string): Promise<ActuatorConfigDTO[]> {
    logger.info("ActuatorReadMethods: Getting actuator configs from the database")

    const option = await new ActuatorService().getActuatorConfig()
    return option.unwrapOrElse(()=>{
      // data is null here means that the database is failing to provide us information
      this.setStatus(408)
      return []
    })
  }

  @Get("config/proposed/get")
  async getProposedActuatorConfigs(@Query() accessToken: string): Promise<ActuatorConfigDTO[]> {
    logger.info("ActuatorReadMethods: Getting proposed actuator configs from the database")

    const option = await new ActuatorService().getProposedActuatorConfig()
    return option.unwrapOrElse(()=>{
      // data is null here means that the database is failing to provide us information
      this.setStatus(408)
      return []
    })
  }
}