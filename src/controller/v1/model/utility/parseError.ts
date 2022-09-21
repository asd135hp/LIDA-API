import { CQRSError } from "../../../../model/v1/error"
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent"
import DatabaseEvent from "../../../../model/v1/events/databaseEvent"

export default function parseError(err: any){
  if(!err) return new DatabaseErrorEvent(
    "Could not retrieve data from the database, please try again later!",
    408
  )
  
  if(typeof(err) === 'string')
    return new DatabaseErrorEvent(
      err.slice(3),
      // HTTP error status code starts from 400
      Math.max(parseInt(err.slice(0, 3)), 400)
    )

  if(typeof(err) === 'object'){
    try {
      const error: CQRSError = err
      if(error.ignore) return error.eventWhenIgnored || new DatabaseEvent({
        error: "",
        info: "",
        type: "Ok",
        warning: "Error is ignored but no normal event is provided"
      })

      return new DatabaseErrorEvent(
        error.message,
        error.statusCode
      )
    } finally {}
  }

  return new DatabaseErrorEvent(
    "Could not retrieve data from the database, please try again later!", 408
  )
}