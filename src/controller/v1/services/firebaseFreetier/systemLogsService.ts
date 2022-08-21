import { logger } from "../../../../constants";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { PublisherImplementor } from "../../../../model/patterns/subscriptionImplementor";
import { LogDTO } from "../../../../model/v1/read/systemLogDto";
import { Log } from "../../../../model/v1/write/systemLog";
import { Option, Some, None } from "../../../../model/patterns/option"
import { COMPONENTS_PATH as fbPath } from "../../../../constants";
import { getLog, pushLog } from "./utility/systemLogsService";

export default class SystemLogsService {
  private publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  async getSensorLogs(oldestTimestamp: number = 0): Promise<Option<LogDTO[]>> {
    const result = await getLog(oldestTimestamp, fbPath.logs.sensor)
    logger.debug(`All logs: ${result}`)
    return result.length ? Some(result.map(json => LogDTO.fromJson(json) as LogDTO)) : None
  }

  async getActuatorLogs(oldestTimestamp: number = 0): Promise<Option<LogDTO[]>> {
    const result = await getLog(oldestTimestamp, fbPath.logs.actuator)
    logger.debug(`All logs: ${result}`)
    return result.length ? Some(result.map(json => LogDTO.fromJson(json) as LogDTO)) : None
  }

  async getSystemCommandLogs(oldestTimestamp: number = 0): Promise<Option<LogDTO[]>> {
    const result = await getLog(oldestTimestamp, fbPath.logs.systemCommand)
    logger.debug(`All logs: ${result}`)
    return result.length ? Some(result.map(json => LogDTO.fromJson(json) as LogDTO)) : None
  }

  async addSensorLog(log: Log): Promise<DatabaseEvent> {
    return await pushLog(fbPath.logs.sensor, log, this.publisher)
  }

  async addActuatorLog(log: Log): Promise<DatabaseEvent> {
    return await pushLog(fbPath.logs.actuator, log, this.publisher)
  }

  async addSystemCommandLog(log: Log): Promise<DatabaseEvent> {
    return await pushLog(fbPath.logs.systemCommand, log, this.publisher)
  }
}