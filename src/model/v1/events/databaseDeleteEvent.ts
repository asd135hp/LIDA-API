import { logger } from "../../../constants";
import { IterableJson } from "../../json";
import DatabaseEvent from "./databaseEvent";

export default class DatabaseDeleteEvent extends DatabaseEvent {
  constructor(values: IterableJson){
    super({
      type: "Ok",
      info: "An delete event has been created. Committing changes to the database",
      error: "",
      warning: "",
      values
    })
    logger.info("A DatabaseDeleteEvent is created!")
  }
}