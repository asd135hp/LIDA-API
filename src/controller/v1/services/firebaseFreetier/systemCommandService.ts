import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import { PublisherImplementor } from "../../../../model/patterns/subscriptionImplementor";
import { persistentFirebaseConnection } from "./firebaseService";
import { Option, Some, None } from "../../../../model/patterns/option"
import DatabaseUpdateEvent from "../../../../model/v1/events/databaseUpdateEvent";
import { createWriteEvent } from "../../../../utility/shorthandOps";
import { SystemCommandDTO } from "../../../../model/v1/read/systemCommandDto";
import { logger } from "../../../../constants";
import { SystemCommand } from "../../../../model/v1/write/systemCommand";

const realtime = persistentFirebaseConnection.realtimeService
const firestore = persistentFirebaseConnection.firestoreService
const path = "systemCommand/flags"

async function firestoreToggleFlag(field: string) {
  const val: SystemCommand = {
    start: false,
    stop: false,
    restart: false,
    pause: false
  }
  val[field] = true

  return await firestore.runTransaction(path, async (snapshot, t) => {
    t.set(snapshot.ref, val)
  })
}

async function realtimeToggleFlag(field: string) {
  const val: SystemCommand = {
    start: false,
    stop: false,
    restart: false,
    pause: false
  }
  val[field] = true

  return await realtime.runTransaction(()=>val, path)
}

export default class SystemCommandService {
  private publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  async setStartSystem(): Promise<DatabaseEvent> {
    const field = "start"
    return await createWriteEvent({
      data: { isStarted: true },
      protectedMethods: {
        async write(){
          await firestoreToggleFlag(field)
        },
        async read(){
          await realtimeToggleFlag(field)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 52"
    }, DatabaseUpdateEvent)
  }
  
  async setPauseSystem(): Promise<DatabaseEvent> {
    const field = "pause"
    return await createWriteEvent({
      data: { isPaused: true },
      protectedMethods: {
        async write(){
          await firestoreToggleFlag(field)
        },
        async read(){
          await realtimeToggleFlag(field)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 69"
    }, DatabaseUpdateEvent)
  }
  
  async setStopSystem(): Promise<DatabaseEvent> {
    const field = "stop"
    return await createWriteEvent({
      data: { isStopped: true },
      protectedMethods: {
        async write(){
          await firestoreToggleFlag(field)
        },
        async read(){
          await realtimeToggleFlag(field)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 86"
    }, DatabaseUpdateEvent)
  }

  async setRestartSystem(): Promise<DatabaseEvent> {
    // could become something else other than just restarting the system
    const field = "restart"
    return await createWriteEvent({
      data: { isRestarted: true },
      protectedMethods: {
        async write(){
          await firestoreToggleFlag(field)
        },
        async read(){
          await realtimeToggleFlag(field)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "SystemCommandService: All database filtration leads to error ~ 104"
    }, DatabaseUpdateEvent)
  }

  async getSystemFlags(): Promise<Option<SystemCommandDTO>> {
    const snapshot = await realtime.getContent(path)
    const flags = await snapshot.val()
    try {
      return flags ? Some(SystemCommandDTO.fromJson(flags) as SystemCommandDTO) : None
    } catch(e) {
      logger.error("SystemCommandService - Caught an error while getting system flags: " + e)
      return None
    }
  }
}