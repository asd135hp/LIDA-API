import { COMPONENTS_PATH as fbPath } from "../../../../../constants"
import { PublisherImplementor } from "../../../../../model/patterns/subscriptionImplementor"
import DatabaseEvent from "../../../../../model/v1/events/databaseEvent"
import { SystemCommand } from "../../../../../model/v1/write/systemCommand"
import DataSavingService from "../dataSavingService"
import { persistentFirebaseConnection } from "../firebaseService"

const realtime = persistentFirebaseConnection.realtimeService
const firestore = persistentFirebaseConnection.firestoreService

export async function firestoreToggleFlag(field: string) {
  const val: SystemCommand = {
    start: false,
    stop: false,
    restart: false,
    pause: false
  }
  val[field] = true

  return await firestore.runTransaction(
    fbPath.systemCommand,
    async (snapshot, t) => {
      t.set(snapshot.ref, val)
    })
}

export async function realtimeToggleFlag(field: string) {
  const val: SystemCommand = {
    start: false,
    stop: false,
    restart: false,
    pause: false
  }
  val[field] = true

  return await realtime.runTransaction(()=>val, fbPath.systemCommand)
}

export async function realtimeSaveSensorSnapshot(publisher: PublisherImplementor<DatabaseEvent>){
  const ref = await realtime.getContent(fbPath.count.run)
  const runCount = ref.exists() ? parseInt(ref.val()) : 0
  
  const dataSaving = new DataSavingService(publisher)
  await realtime.getContent(fbPath.sensor)
  // invoke function here

  // post the next runCount
  await realtime.updateContent(runCount + 1, fbPath.count.run)
}