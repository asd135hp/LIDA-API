import { DateTime } from "luxon";
import { DATABASE_TIMEZONE } from "../../../constants";
import { IterableJson } from "../../json";

export interface Report {
  type: "Ok" | "Error" | "Unknown";
  info: string;
  error: string;
  warning: string;
  values?: IterableJson;
}

interface Timestamp {
  timeStamp: number;
  isoTimeStamp: string;
  normalTimeStamp: string;
}

type CommonEventFormat = Report & Timestamp

export default class DatabaseEvent {
  content: CommonEventFormat;

  constructor(report: Report){
    const now = DateTime.now().setZone(DATABASE_TIMEZONE)
    this.content = {
      ...report,
      timeStamp: now.toUnixInteger(),
      isoTimeStamp: now.toISO(),
      normalTimeStamp: now.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
    }
  }

  static getCompactEvent(event: DatabaseEvent){
    const values = event.content.values
    delete values.protected
    return new DatabaseEvent({
      type: event.content.type,
      info: event.content.info,
      error: event.content.error,
      warning: event.content.warning,
      values: values
    })
  }
}