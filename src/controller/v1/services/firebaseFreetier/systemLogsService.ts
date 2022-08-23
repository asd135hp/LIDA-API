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

  /**
   * Get sensor logs up to the specified log lines limit
   * @param oldestTimestamp Optional, set this to fetch less log since there will be a limit on
   * how many logs will be fetched from the server
   * @returns 
   */
  async getSensorLogs(oldestTimestamp: number = 0): Promise<Option<LogDTO[]>> {
    const result = await getLog(oldestTimestamp, fbPath.logs.sensor)
    logger.debug(`All logs: ${result}`)
    return result.length ? Some(result.map(json => LogDTO.fromJson(json) as LogDTO)) : None
  }

  /**
   * Get actuator logs up to the specified log lines limit
   * @param oldestTimestamp Optional, set this to fetch less log since there will be a limit on
   * how many logs will be fetched from the server
   * @returns 
   */
  async getActuatorLogs(oldestTimestamp: number = 0): Promise<Option<LogDTO[]>> {
    const result = await getLog(oldestTimestamp, fbPath.logs.actuator)
    logger.debug(`All logs: ${result}`)
    return result.length ? Some(result.map(json => LogDTO.fromJson(json) as LogDTO)) : None
  }

  /**
   * Get system command logs up to the specified log lines limit
   * @param oldestTimestamp Optional, set this to fetch less log since there will be a limit on
   * how many logs will be fetched from the server
   * @returns 
   */
  async getSystemCommandLogs(oldestTimestamp: number = 0): Promise<Option<LogDTO[]>> {
    const result = await getLog(oldestTimestamp, fbPath.logs.systemCommand)
    logger.debug(`All logs: ${result}`)
    return result.length ? Some(result.map(json => LogDTO.fromJson(json) as LogDTO)) : None
  }

  /**
   * Add a sensor log to the server
   * @param log 
   * @returns 
   */
  async addSensorLog(log: Log): Promise<DatabaseEvent> {
    return await pushLog(fbPath.logs.sensor, log, this.publisher)
  }

  /**
   * Add an actuator log to the server
   * @param log 
   * @returns 
   */
  async addActuatorLog(log: Log): Promise<DatabaseEvent> {
    return await pushLog(fbPath.logs.actuator, log, this.publisher)
  }

  /**
   * Add a system command log to the server
   * @param log 
   * @returns 
   */
  async addSystemCommandLog(log: Log): Promise<DatabaseEvent> {
    return await pushLog(fbPath.logs.systemCommand, log, this.publisher)
  }
}