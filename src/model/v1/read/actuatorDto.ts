import { DateTime } from "luxon";
import { DATABASE_TIMEZONE } from "../../../constants";
import { IterableJson, JsonConvertible } from "../../json";
import { MotorConfig, ToggleConfig } from "../write/actuators";

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

export enum ActuatorConfigType {
  TOGGLE,
  MOTOR,
  NONE
}

export class ActuatorConfigDTO implements JsonConvertible {
  actuatorName: string;
  timeStamp: number;
  type: ActuatorConfigType
  timesPerDay?: number;
  toggleConfig?: ToggleConfig;
  motorConfig?: MotorConfig[];
  
  constructor(
    actuatorName: string,
    timeStamp: number, timesPerDay: number,
    toggleConfig: ToggleConfig, motorConfig: MotorConfig[]
  ){
    this.actuatorName = actuatorName;
    this.timeStamp = timeStamp;
    this.toggleConfig = toggleConfig;
    this.motorConfig = motorConfig;
    this.timesPerDay = timesPerDay

    // ensure that the type is correct for hardware side usage
    if((timesPerDay === 0 || !motorConfig) && toggleConfig) this.type = ActuatorConfigType.TOGGLE
    else if(!toggleConfig && timesPerDay > 0 && motorConfig) this.type = ActuatorConfigType.MOTOR
    else this.type = ActuatorConfigType.NONE
  }

  toJson(): IterableJson {
    const json: IterableJson = {
      actuatorName: this.actuatorName,
      timeStamp: this.timeStamp,
      timesPerDay: this.timesPerDay,
      type: this.type
    }

    if(!this.motorConfig) json.toggleConfig = this.toggleConfig
    if(!this.toggleConfig) json.motorConfig = this.motorConfig
    return json
  }

  static fromJson(actuatorJson: IterableJson): JsonConvertible {
    const unixNow = DateTime.now().setZone(DATABASE_TIMEZONE).toUnixInteger()
    return new ActuatorConfigDTO(
      typeof(actuatorJson.actuatorName) === 'string' ? actuatorJson.actuatorName : "",
      typeof(actuatorJson.timeStamp) === 'number' ? actuatorJson.timeStamp : unixNow,
      typeof(actuatorJson.timesPerDay) === 'number' ? actuatorJson.timesPerDay : 0,
      typeof(actuatorJson.toggleConfig) === 'object' ? actuatorJson.toggleConfig : null,
      typeof(actuatorJson.motorConfig) === 'object' ? actuatorJson.motorConfig : null
    )
  }
}