import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { PublisherImplementor } from "../../../../model/patterns/subscriptionImplementor";
import { persistentFirebaseConnection } from "./firebaseService";
import { Option, Some, None } from "../../../../model/patterns/option"
import DatabaseUpdateEvent from "../../../../model/v1/events/databaseUpdateEvent";
import { createWriteEvent } from "../../../../utility/shorthandOps";
import { SystemCommandDTO } from "../../../../model/v1/read/systemCommandDto";
import { logger } from "../../../../constants";
import FirebaseFirestoreService from "../../../database/firebase/services/firebaseFirestoreService";
import { firestoreToggleFlag, firestoreUploadFlags, realtimeSaveSensorSnapshot, realtimeToggleFlag, realtimeUploadFlags } from "./utility/systemCommandService";
import { COMPONENTS_PATH } from "../../../../constants"
import { SystemCommand } from "../../../../model/v1/write/systemCommand";

const realtime = persistentFirebaseConnection.realtimeService
const firestore = persistentFirebaseConnection.firestoreService

export default class SystemCommandService {
  private publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  private toggleFlag(flag: string): Promise<DatabaseEvent> {
    return createWriteEvent({
      data: { [flag]: true },
      protectedMethods: {
        async write(){
          await firestoreToggleFlag(flag)
        },
        async read(){
          await realtimeToggleFlag(flag)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 52"
    }, DatabaseUpdateEvent)
  }

  /**
   * This method will set 'start the system' flag to true and reset all other flags to false
   * 
   * NOTE: This method will propose the state of the hardware. It depends on hardware side
   * on whether they will take it or not
   * @returns 
   */
  async setStartSystem(): Promise<DatabaseEvent> {
    return await this.toggleFlag("start")
  }
  
  /**
   * This method will set 'pause the system' flag to true and reset all other flags to false
   * 
   * NOTE: This method will propose the state of the hardware. It depends on hardware side
   * on whether they will take it or not
   * @returns 
   */
  async setPauseSystem(): Promise<DatabaseEvent> {
    return await this.toggleFlag("pause")
  }
  
  /**
   * This method will set 'stop the system' flag to true and reset all other flags to false
   * 
   * NOTE: This method will propose the state of the hardware. It depends on hardware side
   * on whether they will take it or not
   * @returns 
   */
  async setStopSystem(): Promise<DatabaseEvent> {
    return await this.toggleFlag("stop")
  }

  /**
   * This method will set 'restart the system' flag to true and reset all other flags to false
   * 
   * NOTE: This method will propose the state of the hardware. It depends on hardware side
   * on whether they will take it or not
   * @returns 
   */
  async setRestartSystem(): Promise<DatabaseEvent> {
    return await this.toggleFlag("restart")
  }

  /**
   * NOTE: This method is for hardware side usage only
   * 
   * Upload the commited system flags on hardware side to the server
   * @returns 
   */
  async uploadHardwareSystemFlags(flags: SystemCommand): Promise<DatabaseEvent>{
    return await createWriteEvent({
      data: { isRestarted: true },
      protectedMethods: {
        async write(){
          await firestoreUploadFlags(flags)
          if(flags.start) await (firestore as FirebaseFirestoreService).deleteCollection("sensors")
        },
        async read(){
          await realtimeUploadFlags(flags)
          if(flags.start) await realtimeSaveSensorSnapshot(this.publisher)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 104"
    }, DatabaseUpdateEvent)
  }

  /**
   * Get all system flags from the database
   * @returns 
   */
  async getSystemFlags(): Promise<Option<SystemCommandDTO>> {
    const snapshot = await realtime.getContent(COMPONENTS_PATH.systemCommand)
    const flags = await snapshot.val()
    try {
      return flags ? Some(SystemCommandDTO.fromJson(flags) as SystemCommandDTO) : None
    } catch(e) {
      logger.error("SystemCommandService - Caught an error while getting system flags: " + e)
      return None
    }
  }
  
  /**
   * Get all proposed system flags from the database. Hardware usage only
   * @returns 
   */
  async getProposedSystemFlags(): Promise<Option<SystemCommandDTO>> {
    const snapshot = await realtime.getContent(COMPONENTS_PATH.systemCommandProposed)
    const flags = await snapshot.val()
    try {
      return flags ? Some(SystemCommandDTO.fromJson(flags) as SystemCommandDTO) : None
    } catch(e) {
      logger.error("SystemCommandService - Caught an error while getting system flags: " + e)
      return None
    }
  }
}