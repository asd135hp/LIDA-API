import { DateTime } from "luxon";

/**
 * handles an edge case of user putting milliseconds instead of seconds
 * @param timeStamp either in seconds or milliseconds
 * @returns time stamp in seconds format
 */
export function convertTimeStampToSeconds(timeStamp: number){
  const seconds = DateTime.now().toUnixInteger().toString()
  const timeStampStr = timeStamp.toString()
  if(seconds.length + 3 === timeStampStr.length) return Math.floor(timeStamp / 1000)
  if(seconds.length + 2 === timeStampStr.length) return Math.floor(timeStamp / 100)
  if(seconds.length + 1 === timeStampStr.length) return Math.floor(timeStamp / 10)
  return Math.floor(timeStamp)
}