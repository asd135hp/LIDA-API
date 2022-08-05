import { logger } from "../../../constants";
import { IterableJson } from "../../json";
import DatabaseEvent from "./databaseEvent";

export default class DatabaseCreateEvent extends DatabaseEvent {
  constructor(values: IterableJson){
    super({
      type: "Ok",
      info: "A create event has been created. Committing changes to the database",
      error: "",
      warning: "",
      values
    })
    logger.info("A DatabaseCreateEvent is created!")
  }
}