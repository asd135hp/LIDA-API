import { DateTime } from "luxon"
import { COMPONENTS_PATH as fbPath } from "../../../../../constants"
import { PublisherImplementor } from "../../../../../model/patterns/subscriptionImplementor"
import DatabaseErrorEvent from "../../../../../model/v1/events/databaseErrorEvent"
import DatabaseEvent from "../../../../../model/v1/events/databaseEvent"
import { SystemCommand, SystemCommandIterable } from "../../../../../model/v1/write/systemCommand"
import { orderByProp } from "../../../../../utility/helper"
import { persistentFirebaseConnection } from "../firebaseService"
import SensorService from "../sensorService"
import { uploadSnapshot } from "./dataSavingService"

const realtime = persistentFirebaseConnection.realtimeService
const firestore = persistentFirebaseConnection.firestoreService

/// general

export async function firestoreUploadFlags(flags: SystemCommand, isProposed = false){
  return await firestore.runTransaction(
    fbPath.systemCommand,
    async (snapshot, t) => {
      t.set(snapshot.ref, flags)
    })
}

export async function realtimeUploadFlags(flags: SystemCommand, isProposed = false) {
  await realtime.runTransaction(()=>flags, fbPath.systemCommand)
}

/// proposed stage

export async function firestoreToggleFlag(field: string) {
  const flags: SystemCommandIterable = {
    start: false,
    stop: false,
    restart: false,
    pause: false
  }
  flags[field] = true
  return await firestoreUploadFlags(flags, true)
}

export async function realtimeToggleFlag(field: string) {
  const flags: SystemCommandIterable = {
    start: false,
    stop: false,
    restart: false,
    pause: false
  }
  flags[field] = true
  return realtimeUploadFlags(flags, true)
}

/**
 * Use this method if we do not want to rely on frontend code
 * 
 * But it diminishes the properties of a REST API where methods/functions should be independent and pure
 * @param publisher 
 */
export async function realtimeSaveSensorSnapshot(publisher: PublisherImplementor<DatabaseEvent>){
  const ref = await realtime.getContent(fbPath.count.run)
  const runCount = ref.exists() ? parseInt(ref.val()) : 1
  const folderName = `${fbPath.storage.sensor}/run${runCount}`
  
  const sensorService = new SensorService()
  const sensorEvent = await uploadSnapshot(
    (await sensorService.getSensors()).unwrapOr([]).sort(orderByProp("name")),
    { startDate: -1, endDate: -1 },
    folderName,
    publisher,
    65
  )

  // throw error on not being able to upload data
  if(sensorEvent instanceof DatabaseErrorEvent)
    Promise.reject("500Could not process upload data event. Please try again!")

  // loop through all sensorData and retrieve everything in order
  let currentTimestamp = DateTime.now().toUnixInteger()
  while(true){
    // get one day data
    const dateRange = {
      startDate: currentTimestamp - 3600 * 24,
      endDate: currentTimestamp
    }
    const oneDayData = (await sensorService.getSensorData(dateRange)).unwrapOr([])

    if(!oneDayData.length) break;

    // retry upon failure (3 times)
    let count = 0
    while(count !== 3){
      const event = await uploadSnapshot(oneDayData, dateRange, folderName, publisher, 82)
      if(event instanceof DatabaseErrorEvent){ count++; continue }
    }
    // throw error on not being able to upload data
    if(count == 3) Promise.reject("500Could not process upload data event. Please try again!")

    currentTimestamp -= 3600 * 24
  }

  // post the next runCount
  await realtime.updateContent(runCount + 1, fbPath.count.run)
}