import { DateTime } from "luxon";
import { DATABASE_TIMEZONE } from "../../../constants";
import { IterableJson, JsonConvertible } from "../../json";

export class LogDTO {
  timeStamp: number;
  logContent: string;

  constructor(logContent: string, timeStamp: number){
    this.timeStamp = timeStamp
    this.logContent = logContent
  }

  toJson(): IterableJson {
    return {
      timeStamp: this.timeStamp,
      logContent: this.logContent
    }
  }

  static fromJson(logJson: IterableJson): JsonConvertible {
    const unixNow = DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()
    return new LogDTO(
      typeof(logJson.logContent) === 'string' ? logJson.logContent : "",
      typeof(logJson.timeStamp) === 'number' ? logJson.timeStamp : unixNow
    )
  }
}