import { logger } from "../../../constants";
import { IterableJson } from "../../json";
import DatabaseEvent from "./databaseEvent";

export default class DatabaseAddEvent extends DatabaseEvent {
  constructor(values: IterableJson){
    super({
      type: "Ok",
      info: "An add event has been created. Committing changes to the database...",
      error: "",
      warning: "",
      values
    })
    logger.info("A DatabaseAddEvent is created!")
  }
}