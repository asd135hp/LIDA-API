import { PublisherImplementor } from "../../patterns/subscriptionImplementor";
import DatabaseEvent from "../events/databaseEvent";
import { ActuatorDTO, ActuatorConfigDTO } from "../read/actuatorDto";
import { Actuator, UpdatingActuator, ActuatorConfig } from "../write/actuators";
import { Option } from "../../patterns/option"

export abstract class ActuatorServiceFacade {
  protected publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  /**
   * Dumps all actuator details in the database
   * @returns 
   */
  abstract getActuators(): Promise<Option<ActuatorDTO[]>>;

  /**
   * Get all actuator details by its designated type
   * @param type Type of actuator
   * @returns All actuator details with matched type
   */
  abstract getActuatorsByType(type: string): Promise<Option<ActuatorDTO[]>>;

  /**
   * Get a single actuator detail by name
   * @param name Name of the actuator, should be unique
   * @returns A single actuator detail with a matched name
   */
  abstract getActuatorByName(name: string): Promise<Option<ActuatorDTO>>;
  
  /**
   * Get all actuator configs that is pending to be executed irl
   * @returns List of actuator configs
   */
  abstract getActuatorConfig(): Promise<Option<ActuatorConfigDTO[]>>

  /**
   * This is for hardware side usage for fetching relevant data
   */
  abstract getProposedActuatorConfig(): Promise<Option<ActuatorConfigDTO[]>>;

  /**
   * Add a single actuator detail to the database
   * @param actuator Details about the actuator
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  abstract addActuator(actuator: Actuator): Promise<DatabaseEvent>;

  /**
   * Update a single actuator to the database
   * @param actuator Details about the actuator
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  abstract updateActuator(actuator: UpdatingActuator): Promise<DatabaseEvent>;

  /**
   * Update the real actuator configs in the database
   * @param actuatorName Name of the actuator
   * @param actuatorConfig An actuator config, related by name
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  abstract updateActuatorConfig(actuatorName: string, actuatorConfig: ActuatorConfig): Promise<DatabaseEvent>;
  
  /**
   * Update the proposed state of actuator configs in the database
   * @param actuatorName Name of the actuator
   * @param actuatorConfig An actuator config, related by name
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  abstract updateProposedActuatorConfig(actuatorName: string, actuatorConfig: ActuatorConfig): Promise<DatabaseEvent>;
}