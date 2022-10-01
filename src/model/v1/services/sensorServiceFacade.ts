import { UnixDateRange } from "../../dateRange";
import { Option } from "../../patterns/option";
import { PublisherImplementor } from "../../patterns/subscriptionImplementor";
import DatabaseEvent from "../events/databaseEvent";
import { SensorDTO, SensorDataDTO } from "../read/sensorDto";
import { SensorData, Sensor, UpdatingSensor, DatabaseSensorData } from "../write/sensors";

export abstract class SensorServiceFacade {
  protected publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  /**
   * Dumps all sensor details stored in the database
   * @returns All sensors in the database
   */
  abstract getSensors(): Promise<Option<SensorDTO[]>>;

  /**
   * Get all sensor details by its designated type
   * @param type Type of sensor
   * @returns All sensor details with matched type
   */
  abstract getSensorsByType(type: string): Promise<Option<SensorDTO[]>>;

  /**
   * Get a single sensor detail by name
   * @param name Name of the sensor, should be unique
   * @returns A single sensor detail with a matched name
   */
  abstract getSensorByName(name: string): Promise<Option<SensorDTO>>;

  /**
   * Get all sensor data by date range
   * @param dateRange Date range to limit how much data is downloaded
   * @returns All sensor data filtered by date range
   */
  abstract getSensorData(dateRange?: UnixDateRange): Promise<Option<SensorDataDTO[]>>;

  /**
   * Get all sensor data by name and date range
   * @param name Name associated with sensor data
   * @param dateRange Date range to limit how much data is downloaded
   * @returns All sensor data filtered by name and date range
   */
  abstract getSensorDataByName(
    name: string,
    dateRange?: UnixDateRange
  ): Promise<Option<SensorDataDTO[]>>;

  /**
   * 
   * @param dateRange 
   * @returns 
   */
  abstract getSensorDataSnapshot(dateRange?: UnixDateRange): Promise<Option<SensorData[][]>>;

  /**
   * Get the latest sensot data from the database
   */
  abstract getLatestSensorData(): Promise<Option<SensorDataDTO[]>>;

  /**
   * Get the latest sensor data by name.
   * It is assumed that front-end will only need to use the most recent data sorted by sensor name
   * @param name Sensor name
   * @returns
   */
  abstract getLatestSensorDataByName(name: string): Promise<Option<SensorDataDTO>>;

  /**
   * Add a single sensor to the database, this is cooperated with an anti-duping method
   * @param sensor Details about the sensor
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  abstract addSensor(sensor: Sensor): Promise<DatabaseEvent>;

  /**
   * Update a single sensor to the database
   * @param sensor Details about the sensor
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  abstract updateSensor(sensor: UpdatingSensor): Promise<DatabaseEvent>;

  /**
   * Add a single sensor data to the database
   * @param sensorData Data related to a sensor, related by name
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  abstract addSensorData(sensorName: string, sensorData: SensorData): Promise<DatabaseEvent>;

  /**
   * Add a bundle of sensor data to the database
   * @param sensorData Data related to a sensor, related by name
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  abstract addSensorDataByBundle(sensorData: DatabaseSensorData[]): Promise<DatabaseEvent>;

  /**
   * WARNING: Avoid using this method unless it is necessary
   * 
   * Delete all sensor data stored in the firebase database
   * @returns 
   */
  abstract deleteSensorData(): Promise<DatabaseEvent>;
}