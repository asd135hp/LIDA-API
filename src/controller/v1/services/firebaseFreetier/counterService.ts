import { persistentFirebaseConnection } from "./firebaseService";
import { COMPONENTS_PATH as fbPath, LOG_LINES } from "../../../../constants";

const realtime = persistentFirebaseConnection.realtimeService

export default class CounterService {
  constructor(){}

  /**
   * Increment log counter based on which counter is used for this method
   * @param whichCounter Name of the counter to be used. Can have alphanumerics, slashes and underscores but nothing else
   * @param by BY how much will the counter increment
   */
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
  
  /**
   * Reset the log counter based on which counter is used for this method
   * @param whichCounter Name of the counter to be used. Can have alphanumerics, slashes and underscores but nothing else
   * @param to How much will the counter reset to (from 100 to 0 for example)
   */
  async resetLogCounter(whichCounter: string, to = 1) {
    let count = -1
    await realtime.getContent(`${fbPath.count.path}/${whichCounter}`, async ref => {
      // looks more clean - update log count
      count = (await ref.transaction(_ => to)).snapshot.val()
    })
    return count
  }
  
  /**
   * Increment system run counter based on which counter is used for this method.
   * Immutable
   */
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