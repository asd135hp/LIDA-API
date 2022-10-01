import { persistentFirebaseConnection } from "./firebaseService";
import { COMPONENTS_PATH as fbPath, LOG_LINES } from "../../../../constants";
import { CounterServiceFacade } from "../../../../model/v1/services/counterServiceFacade";

const realtime = persistentFirebaseConnection.realtimeService

export default class CounterService extends CounterServiceFacade {
  async incrementLogCounter(whichCounter: string, by = 1, maxCounter = LOG_LINES) {
    let count = -1
    await realtime.getContent(`${fbPath.count.path}/${whichCounter}`, async ref => {
      // looks more clean - update log count
      count = (await ref.transaction(val => {
        if(typeof(val) !== 'number') return 1
        if(val < maxCounter) return val + by
        return val
      })).snapshot.val()
    })
    return count
  }
  
  async resetLogCounter(whichCounter: string, to = 1) {
    let count = -1
    await realtime.getContent(`${fbPath.count.path}/${whichCounter}`, async ref => {
      // looks more clean - update log count
      count = (await ref.transaction(_ => to)).snapshot.val()
    })
    return count
  }
  
  async incrementSystemRunCounter() {
    let count = -1
    await realtime.getContent(`${fbPath.count.run}`, async ref => {
      // looks more clean - update run count
      const transaction = await ref.transaction(val => typeof(val) !== 'number' ? 1 : val + 1)
      count = transaction.snapshot.val()
    })
    return count
  }
}