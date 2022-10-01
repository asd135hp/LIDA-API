import { PublisherImplementor } from "../../patterns/subscriptionImplementor";
import DatabaseEvent from "../events/databaseEvent";
import { SystemCommandDTO } from "../read/systemCommandDto";
import { SystemCommand } from "../write/systemCommand";
import { Option } from "../../patterns/option"

export abstract class SystemCommandServiceFacade {
  protected publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  /**
   * This method will set 'start the system' flag to true and reset all other flags to false
   * 
   * NOTE: This method will propose the state of the hardware. It depends on hardware side
   * on whether they will take it or not
   * @returns 
   */
  abstract setStartSystem(): Promise<DatabaseEvent>;
  
  /**
   * This method will set 'pause the system' flag to true and reset all other flags to false
   * 
   * NOTE: This method will propose the state of the hardware. It depends on hardware side
   * on whether they will take it or not
   * @returns 
   */
  abstract setPauseSystem(): Promise<DatabaseEvent>;

  /**
   * This method will set 'stop the system' flag to true and reset all other flags to false
   * 
   * NOTE: This method will propose the state of the hardware. It depends on hardware side
   * on whether they will take it or not
   * @returns 
   */
  abstract setStopSystem(): Promise<DatabaseEvent>;

  /**
   * This method will set 'restart the system' flag to true and reset all other flags to false
   * 
   * NOTE: This method will propose the state of the hardware. It depends on hardware side
   * on whether they will take it or not
   * @returns 
   */
  abstract setRestartSystem(): Promise<DatabaseEvent>;

  /**
   * NOTE: This method is for hardware side usage only
   * 
   * Upload the commited system flags on hardware side to the server
   * @returns 
   */
  abstract uploadHardwareSystemFlags(flags: SystemCommand): Promise<DatabaseEvent>;

  /**
   * Get all system flags from the database
   * @returns 
   */
  abstract getSystemFlags(): Promise<Option<SystemCommandDTO>>;
  
  /**
   * Get all proposed system flags from the database. Hardware usage only
   * @returns 
   */
  abstract getProposedSystemFlags(): Promise<Option<SystemCommandDTO>>;
}