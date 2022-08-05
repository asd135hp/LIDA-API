import { logger } from "../../../constants";
import { IterableJson } from "../../json";
import DatabaseEvent from "./databaseEvent";

export default class DatabaseUpdateEvent extends DatabaseEvent {
  constructor(values: IterableJson){
    super({
      type: "Ok",
      info: "An update event has been created. Committing changes to the database...",
      error: "",
      warning: "",
      values
    })
    logger.info("A DatabaseUpdateEvent is created!")
  }
}