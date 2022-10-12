import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { persistentFirebaseConnection } from "./firebaseService";
import { Option, Some, None } from "../../../../model/patterns/option"
import DatabaseUpdateEvent from "../../../../model/v1/events/databaseUpdateEvent";
import { createWriteEvent } from "../../../../utility/firebase/shorthandOps";
import { SystemCommandDTO } from "../../../../model/v1/read/systemCommandDto";
import { logger } from "../../../../constants";
import FirebaseFirestoreService from "../../../database/firebase/services/firebaseFirestoreService";
import { firestoreToggleFlag, firestoreUploadFlags, realtimeSaveSensorSnapshot, realtimeToggleFlag, realtimeUploadFlags } from "./utility/systemCommandService";
import { COMPONENTS_PATH } from "../../../../constants"
import { SystemCommand } from "../../../../model/v1/write/systemCommand";
import { SystemCommandServiceFacade } from "../../../../model/v1/services/systemCommandServiceFacade";

const realtime = persistentFirebaseConnection.realtimeService
const firestore = persistentFirebaseConnection.firestoreService

export default class SystemCommandService extends SystemCommandServiceFacade {
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

  async setStartSystem(): Promise<DatabaseEvent> {
    return await this.toggleFlag("start")
  }
  
  async setPauseSystem(): Promise<DatabaseEvent> {
    return await this.toggleFlag("pause")
  }
  
  async setStopSystem(): Promise<DatabaseEvent> {
    return await this.toggleFlag("stop")
  }

  async setRestartSystem(): Promise<DatabaseEvent> {
    return await this.toggleFlag("restart")
  }

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