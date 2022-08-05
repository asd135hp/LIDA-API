import {
  Post, Patch, Route, SuccessResponse,
  Response, Controller, Security, BodyProp, Path, Header, Query } from "tsoa";
import { logger } from "../../../../constants";
import { apiPath } from "../../../../constants.config.json"
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { Actuator, ActuatorCommand, UpdatingActuator } from "../../../../model/v1/write/actuators";
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
  
  @Post("{actuatorName}/command/add")
  async addActuatorCommand(
    @Query() accessToken: string,
    @Path() actuatorName: string,
    @BodyProp() actuatorCommand: ActuatorCommand
  ): Promise<DatabaseEvent> {
    logger.info(`ActuatorWriteMethods: Adding actuator command to the database for actuator "${actuatorName}"`)

    // return appropriate status code from internal system
    const event = await this.service.addActuatorCommand(actuatorName, actuatorCommand)
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }

    return getEvent(event)
  }

  @Patch("command/{id}/resolve")
  async resolveActuatorCommand(
    @Query() accessToken: string,
    @Path() id: number
  ): Promise<DatabaseEvent> {
    logger.info("ActuatorWriteMethods: Resolving actuator command to the database")

    // return appropriate status code from internal system
    const event = await this.service.resolveActuatorCommand(id)
    if(event instanceof DatabaseErrorEvent){
      this.setStatus(event.content.values.statusCode)
    }

    return getEvent(event)
  }
}