import { DateTime } from "luxon"
import { DATABASE_TIMEZONE } from "../constants"
import { FirebaseDateRange } from "../model/dateRange"

/**
 * Auxiliary function that allows an object to be compared using its property
 * @param prop Property of an object to be compared. Wrong property will lead to error to be thrown
 * @param ascending Sort the list in an ascending order or not, default true
 * @returns A function that could be used by sorting methods for sorting and searching stuffs.
 * The result of that function will be 0 - equals, 1 - to the right, -1 - to the left.
 */
export function orderByProp(prop: string, ascending = true){
  return (s1: any, s2: any) => {
    if(s1[prop] == s2[prop]) return 0
    const result = s1[prop] > s2[prop] ? 1 : -1
    return ascending ? result : -result
  }
}

/**
 * Converts Unix daterange timestamps to ISO Datetime strings instead
 * @param dateRange 
 * @returns 
 */
export function getDateRangeString(dateRange: FirebaseDateRange){
  return {
    start: DateTime.fromSeconds(dateRange.startDate || 0).setZone(DATABASE_TIMEZONE).toISOTime(),
    end: (dateRange.endDate ? DateTime.fromSeconds(dateRange.endDate) : DateTime.now())
      .setZone(DATABASE_TIMEZONE)
      .toISOTime() 
  }
}

export function hexStringConverter(buffer: Buffer){
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const charList = (()=>{
  let str = ""
  // digits
  for(let i = 48; i <= 57; i++) str += String.fromCharCode(i)
  // uppercases
  for(let i = 65; i <= 90; i++) str += String.fromCharCode(i)
  // lowercases
  for(let i = 97; i <= 122; i++) str += String.fromCharCode(i)
  
  return str
})()
export function randomString(length: number, extendedCharList = ""){
  const newCharList = charList + extendedCharList
  const len = charList.length
  const randVals = Array.from(crypto.getRandomValues(new Uint8Array(length)))
  return randVals.map(num => newCharList[Math.round(num * (len - 1) / 255)]).join('')
}