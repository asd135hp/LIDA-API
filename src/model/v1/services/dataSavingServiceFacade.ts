import { SensorSnapshot } from "../../../controller/v1/services/firebaseFreetier/utility/dataSavingService";
import { FirebaseDateRange } from "../../dateRange";
import { IterableJson } from "../../json";
import { PublisherImplementor } from "../../patterns/subscriptionImplementor";
import DatabaseEvent from "../events/databaseEvent";
import { SnapshotDownloadResponse } from "../read/dataSaving";
import { Option } from "../../patterns/option"

export abstract class DataSavingServiceFacade {
  protected publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  /**
   * Retrive sensor snapshots in chunks by date
   * @param runNumber Run number that is associated with that snapshot
   * @returns None on an empty array, otherwise Some
   */
  abstract retrieveSensorSnapshot(runNumber: number): Promise<Option<SnapshotDownloadResponse[]>>;

  /**
   * More performant log snapshots retrieval method since it will only apply filter only on sensor logs
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  abstract retrieveSensorLogSnapshots(dateRange?: FirebaseDateRange): Promise<Option<IterableJson[]>>;

  /**
   * More performant log snapshots retrieval method since it will only apply filter only on actuator logs
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  abstract retrieveActuatorLogSnapshots(dateRange?: FirebaseDateRange): Promise<Option<IterableJson[]>>;

  /**
   * More performant log snapshots retrieval method since it will only apply filter only on system command logs
   * @param dateRange 
   * @returns None on an empty array, otherwise Some
   */
  abstract retrieveSystemCommandLogSnapshots(dateRange?: FirebaseDateRange): Promise<Option<IterableJson[]>>;

  /**
   * Upload what is considered to be a snapshot of sensor data in a period of time to a sensor folder on the server
   * @param snapshots 
   * @param runNumber
   * @returns 
   */
  abstract uploadSensorSnapshot(snapshots: SensorSnapshot, runNumber: number): Promise<DatabaseEvent>;
  /**
   * Upload what is considered to be a snapshot of logs in a period of time to a log folder on the server
   * @param snapshot 
   * @param dateRange 
   * @returns 
   */
  abstract uploadLogSnapshot(snapshot: IterableJson, dateRange: FirebaseDateRange): Promise<DatabaseEvent>;

  /**
   * Delete log snapshots of a specific date range - not functional
   * @param runNumber 
   * @returns 
   */
  abstract deleteLogSnapshots(dateRange: FirebaseDateRange): Promise<DatabaseEvent>;
}