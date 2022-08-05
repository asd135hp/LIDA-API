import { IterableJson, JsonConvertible } from "../../json";

export class SystemCommandDTO {
  isStart: boolean
  isPause: boolean
  isStop: boolean
  isRestart: boolean

  constructor(isStart: boolean, isPause: boolean, isStop: boolean, isRestart: boolean){
    this.isStart = isStart
    this.isPause = isPause
    this.isStop = isStop
    this.isRestart = isRestart
  }

  toJson(): IterableJson {
    return {
      isStart: this.isStart,
      isPause: this.isPause,
      isStop: this.isStop,
      isRestart: this.isRestart
    }
  }

  static fromJson(commandJson: IterableJson): JsonConvertible {
    return new SystemCommandDTO(
      commandJson && typeof(commandJson.start) === 'boolean' ? commandJson.start : false,
      commandJson && typeof(commandJson.pause) === 'boolean' ? commandJson.pause : false,
      commandJson && typeof(commandJson.stop) === 'boolean' ? commandJson.stop : false,
      commandJson && typeof(commandJson.restart) === 'boolean' ? commandJson.restart : false
    )
  }
}