import { logger } from "../../../constants";
import DatabaseEvent from "./databaseEvent";

export default class DatabaseErrorEvent extends DatabaseEvent {
  constructor(reason: string, statusCode: number = 200){
    super({
      type: "Error",
      info: "An error occurred!",
      error: reason,
      warning: "",
      values: {
        statusCode
      }
    })
    logger.info("A DatabaseErrorEvent is created!")
  }
}