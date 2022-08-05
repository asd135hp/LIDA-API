"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemCommandDTO = void 0;
class SystemCommandDTO {
    constructor(isStart, isPause, isStop, isRestart) {
        this.isStart = isStart;
        this.isPause = isPause;
        this.isStop = isStop;
        this.isRestart = isRestart;
    }
    toJson() {
        return {
            isStart: this.isStart,
            isPause: this.isPause,
            isStop: this.isStop,
            isRestart: this.isRestart
        };
    }
    static fromJson(commandJson) {
        return new SystemCommandDTO(commandJson && typeof (commandJson.start) === 'boolean' ? commandJson.start : false, commandJson && typeof (commandJson.pause) === 'boolean' ? commandJson.pause : false, commandJson && typeof (commandJson.stop) === 'boolean' ? commandJson.stop : false, commandJson && typeof (commandJson.restart) === 'boolean' ? commandJson.restart : false);
    }
}
exports.SystemCommandDTO = SystemCommandDTO;
//# sourceMappingURL=systemCommandDto.js.map