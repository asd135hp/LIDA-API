import {
  Post, Patch, Route, SuccessResponse,
  Response, Controller, Security, BodyProp, Path, Header, Query } from "tsoa";
import { logger } from "../../../../constants";
import { apiPath } from "../../../../constants.config.json"
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { Actuator, ActuatorConfig, UpdatingActuator } from "../../../../model/v1/write/actuators";
import ActuatorService from "../../services/firebaseFreetier/actuatorService";
import SystemLogsService from "../../services/firebaseFreetier/systemLogsService";
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent";

const getEvent = DatabaseEvent.getCompactEvent

@Security("api_key")
@Route(`api/v1/actuator`)
@SuccessResponse(200, "Ok")
@Response(400, "Bad Request")
@Response(401, "Unauthorized")
@Response(403, "Forbidden")
@Response(404, "Not Found")
@Response(408, "Request Timeout")
export class ActuatorWriteMethods extends Controller {
  static mainService: ActuatorService;

  private service: ActuatorService;
  private logger: SystemLogsService;

  constructor(){
    super()
    this.service = ActuatorWriteMethods.mainService
  }

  @Post("add")
  async addActuator(
    @Query() accessToken: string,
    @BodyProp() actuator: Actuator
  ): Promise<DatabaseEvent> {
    logger.info(`ActuatorWriteMethods: Adding actuator "${actuator.name}" to the database`)

    const event = await this.service.addActuator(actuator)
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }

    return getEvent(event)
  }

  @Patch("update")
  async updateActuator(
    @Query() accessToken: string,
    @BodyProp() actuator: UpdatingActuator
  ): Promise<DatabaseEvent> {
    logger.info(`ActuatorWriteMethods: Updating actuator "${actuator.name}" information in the database`)

    const event = await this.service.updateActuator(actuator)
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }

    return getEvent(event)
  }
  
  @Post("{actuatorName}/config/update")
  async updateActuatorConfig(
    @Query() accessToken: string,
    @Path() actuatorName: string,
    @BodyProp() actuatorConfig: ActuatorConfig
  ): Promise<DatabaseEvent> {
    logger.info(`ActuatorWriteMethods: Updating config for actuator "${actuatorName}"`)

    // return appropriate status code from internal system
    const event = await this.service.updateActuatorConfig(actuatorName, actuatorConfig)
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }

    return getEvent(event)
  }

  @Patch("{actuatorName}/config/proposed/update")
  async updateProposedActuatorConfig(
    @Query() accessToken: string,
    @Path() actuatorName: string,
    @BodyProp() actuatorConfig: ActuatorConfig
  ): Promise<DatabaseEvent> {
    logger.info(`ActuatorWriteMethods: Updating config for actuator "${actuatorName}"`)

    // return appropriate status code from internal system
    const event = await this.service.updateProposedActuatorConfig(actuatorName, actuatorConfig)
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }

    return getEvent(event)
  }
}