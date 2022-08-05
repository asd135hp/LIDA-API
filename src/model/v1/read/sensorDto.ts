import { DateTime } from "luxon";
import { DATABASE_TIMEZONE, logger } from "../../../constants";
import { IterableJson, JsonConvertible } from "../../json";

export class SensorDTO implements JsonConvertible {
  name: string;
  type: string;
  isRunning: boolean;

  constructor(name: string, type: string, isRunning: boolean){
    this.name = name
    this.type = type
    this.isRunning = isRunning
  }
  
  toJson(): IterableJson {
    return {
      name: this.name,
      type: this.type,
      isRunning: this.isRunning
    }
  }

  static fromJson(sensorJson: IterableJson): JsonConvertible {
    return new SensorDTO(
      typeof(sensorJson.name) === 'string' ? sensorJson.name : "",
      typeof(sensorJson.type) === 'string' ? sensorJson.type : "",
      typeof(sensorJson.isRunning) === 'boolean' ? sensorJson.isRunning : true)
  }
}

export class SensorDataDTO implements JsonConvertible {
  sensorName: string;
  value: number;
  timeStamp: number;

  constructor(sensorName: string, value: number, timeStamp: number){
    this.sensorName = sensorName;
    this.value = value;
    this.timeStamp = timeStamp;
  }

  toJson(): IterableJson {
    return {
      sensorName: this.sensorName,
      value: this.value,
      timeStamp: this.timeStamp
    }
  }

  static fromJson(sensorJson: any): JsonConvertible {
    const unixNow = DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()
    return new SensorDataDTO(
      typeof(sensorJson.sensorName) === 'string' ? sensorJson.sensorName : '',
      typeof(sensorJson.value) === 'number' ? sensorJson.value : -1,
      typeof(sensorJson.timeStamp) === 'number' ? sensorJson.timeStamp : unixNow
    )
  }
}