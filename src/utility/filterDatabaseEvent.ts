import DatabaseErrorEvent from "../model/v1/events/databaseErrorEvent";
import DatabaseEvent from "../model/v1/events/databaseEvent";
import { Option, Some, None } from "../model/patterns/option"

type Constructor<T> = new (...args: any[]) => T

/**
 * Filter database event with a bias of not allowing error events to happen
 * @param events 
 * @param filterType Expected to be seen event
 * @returns 
 */
export function filterDatabaseEvent<ExpectedEvent extends DatabaseEvent>(
  events: DatabaseEvent[],
  filterType?: Constructor<ExpectedEvent>
): Option<DatabaseEvent> {
  const arr = events.filter(ev => filterType && typeof(filterType) == 'object' && !(ev instanceof filterType))
  if(arr.length == 0){
    const withoutErrArr = events.filter(ev => !(ev instanceof DatabaseErrorEvent))
    return withoutErrArr.length >= 1 ? Some(withoutErrArr[0]) : None
  }
  return arr.length >= 1 ? Some(arr[0]) : None
}