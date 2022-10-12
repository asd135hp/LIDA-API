import { SensorWriteMethods } from "./v1/methods/write/sensorWriteMethods";
import { ActuatorWriteMethods } from "./v1/methods/write/actuatorWriteMethods";
import { SystemLogsWriteMethods } from "./v1/methods/write/systemLogsWriteMethods";
import { PublisherImplementor } from "../model/patterns/subscriptionImplementor";
import { DataSavingWriteMethods } from "./v1/methods/write/dataSavingWriteMethods";
import { logger } from "../constants";
import DatabaseEvent from "../model/v1/events/databaseEvent";
import {
  SensorService, ActuatorService, SystemLogsService, SystemCommandService, DataSavingService
} from "./v1/services/serviceEntries"
import { SystemCommandWriteMethods } from "./v1/methods/write/systemCommandWriteMethods";

export default class CommandFacade extends PublisherImplementor<DatabaseEvent> {
  static sensor: SensorWriteMethods;
  static actuator: ActuatorWriteMethods;
  static logs: SystemLogsWriteMethods;
  static dataSaving: DataSavingWriteMethods;
  static systemCommand: SystemCommandWriteMethods;

  constructor(){
    super()

    // set up services for the publishers to be enabled
    SensorWriteMethods.mainService = new SensorService(this)
    ActuatorWriteMethods.mainService = new ActuatorService(this)
    SystemLogsWriteMethods.mainService = new SystemLogsService(this)
    DataSavingWriteMethods.mainService = new DataSavingService(this)
    SystemCommandWriteMethods.mainService = new SystemCommandService(this)

    // set up methods later
    CommandFacade.sensor = new SensorWriteMethods()
    CommandFacade.actuator = new ActuatorWriteMethods()
    CommandFacade.logs = new SystemLogsWriteMethods()
    CommandFacade.dataSaving = new DataSavingWriteMethods()
    CommandFacade.systemCommand = new SystemCommandWriteMethods()
    
    logger.debug("CommandFacade is initialized. It is safe to make data transactions now!")
  }
}