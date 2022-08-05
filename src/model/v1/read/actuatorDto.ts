import { DateTime } from "luxon";
import { DATABASE_TIMEZONE } from "../../../constants";
import { IterableJson, JsonConvertible } from "../../json";
import { MotorCommand, ToggleCommand } from "../write/actuators";

export class ActuatorDTO implements JsonConvertible {
  name: string;
  type: string;
  isRunning: boolean;

  constructor(name: string, type: string, isRunning: boolean){
    this.name = name
    this.type = type
    this.isRunning = isRunning;
  }
  
  toJson(): IterableJson {
    return {
      name: this.name,
      type: this.type,
      isRunning: this.isRunning
    }
  }

  static fromJson(actuatorJson: IterableJson): JsonConvertible {
    return new ActuatorDTO(
      typeof(actuatorJson.name) === 'string' ? actuatorJson.name : "",
      typeof(actuatorJson.type) === 'string' ? actuatorJson.type : "",
      typeof(actuatorJson.isRunning) === 'boolean' ? actuatorJson.isRunning : true)
  }
}

export class ActuatorCommandDTO implements JsonConvertible {
  id: number;
  actuatorName: string;
  timeStamp: number;
  timesPerDay: number;
  toggleCommand?: ToggleCommand;
  motorCommand?: MotorCommand[];

  constructor(
    id: number, actuatorName: string,
    timeStamp: number, timesPerDay: number,
    toggleCommand: ToggleCommand, motorCommand: MotorCommand[]
  ){
    this.id = id;
    this.actuatorName = actuatorName;
    this.timeStamp = timeStamp;
    this.toggleCommand = toggleCommand;
    this.motorCommand = motorCommand;
    this.timesPerDay = timesPerDay
  }

  toJson(): IterableJson {
    const json: IterableJson = {
      id: this.id,
      actuatorName: this.actuatorName,
      timeStamp: this.timeStamp,
      timesPerDay: this.timesPerDay
    }

    if(!this.motorCommand) json.toggleCommand = this.toggleCommand
    if(!this.toggleCommand) json.motorCommand = this.motorCommand
    return json
  }

  static fromJson(actuatorJson: IterableJson): JsonConvertible {
    const unixNow = DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()
    return new ActuatorCommandDTO(
      typeof(actuatorJson.id) === 'number' ? actuatorJson.id : -1,
      typeof(actuatorJson.actuatorName) === 'string' ? actuatorJson.actuatorName : "",
      typeof(actuatorJson.timeStamp) === 'number' ? actuatorJson.timeStamp : unixNow,
      typeof(actuatorJson.timesPerDay) === 'number' ? actuatorJson.timesPerDay : 0,
      typeof(actuatorJson.toggleCommand) === 'object' ? actuatorJson.toggleCommand : null,
      typeof(actuatorJson.motorCommand) === 'object' ? actuatorJson.motorCommand : null
    )
  }
}