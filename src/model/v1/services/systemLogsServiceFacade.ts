import { PublisherImplementor } from "../../patterns/subscriptionImplementor";
import DatabaseEvent from "../events/databaseEvent";
import { LogDTO } from "../read/systemLogDto";
import { Log } from "../write/systemLog";
import { Option } from "../../patterns/option";

export abstract class SystemLogsServiceFacade {
  protected publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  /**
   * Get sensor logs up to the specified log lines limit
   * @param oldestTimestamp Optional, set this to fetch less log since there will be a limit on
   * how many logs will be fetched from the server
   * @returns 
   */
  abstract getSensorLogs(oldestTimestamp?: number): Promise<Option<LogDTO[]>>;

  /**
   * Get actuator logs up to the specified log lines limit
   * @param oldestTimestamp Optional, set this to fetch less log since there will be a limit on
   * how many logs will be fetched from the server
   * @returns 
   */
  abstract getActuatorLogs(oldestTimestamp?: number): Promise<Option<LogDTO[]>>;

  /**
   * Get system command logs up to the specified log lines limit
   * @param oldestTimestamp Optional, set this to fetch less log since there will be a limit on
   * how many logs will be fetched from the server
   * @returns 
   */
  abstract getSystemCommandLogs(oldestTimestamp?: number): Promise<Option<LogDTO[]>>;

  /**
   * Add a sensor log to the server
   * @param log 
   * @returns 
   */
  abstract addSensorLog(log: Log): Promise<DatabaseEvent>;

  /**
   * Add an actuator log to the server
   * @param log 
   * @returns 
   */
  abstract addActuatorLog(log: Log): Promise<DatabaseEvent>;

  /**
   * Add a system command log to the server
   * @param log 
   * @returns 
   */
  abstract addSystemCommandLog(log: Log): Promise<DatabaseEvent>;
}