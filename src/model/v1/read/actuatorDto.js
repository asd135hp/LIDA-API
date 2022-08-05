"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActuatorCommandDTO = exports.ActuatorDTO = void 0;
const luxon_1 = require("luxon");
const constants_1 = require("../../../constants");
class ActuatorDTO {
    constructor(name, type, isRunning) {
        this.name = name;
        this.type = type;
        this.isRunning = isRunning;
    }
    toJson() {
        return {
            name: this.name,
            type: this.type,
            isRunning: this.isRunning
        };
    }
    static fromJson(actuatorJson) {
        return new ActuatorDTO(typeof (actuatorJson.name) === 'string' ? actuatorJson.name : "", typeof (actuatorJson.type) === 'string' ? actuatorJson.type : "", typeof (actuatorJson.isRunning) === 'boolean' ? actuatorJson.isRunning : true);
    }
}
exports.ActuatorDTO = ActuatorDTO;
class ActuatorCommandDTO {
    constructor(id, actuatorName, timeStamp, timesPerDay, toggleCommand, motorCommand) {
        this.id = id;
        this.actuatorName = actuatorName;
        this.timeStamp = timeStamp;
        this.toggleCommand = toggleCommand;
        this.motorCommand = motorCommand;
        this.timesPerDay = timesPerDay;
    }
    toJson() {
        const json = {
            id: this.id,
            actuatorName: this.actuatorName,
            timeStamp: this.timeStamp,
            timesPerDay: this.timesPerDay
        };
        if (!this.motorCommand)
            json.toggleCommand = this.toggleCommand;
        if (!this.toggleCommand)
            json.motorCommand = this.motorCommand;
        return json;
    }
    static fromJson(actuatorJson) {
        const unixNow = luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger();
        return new ActuatorCommandDTO(typeof (actuatorJson.id) === 'number' ? actuatorJson.id : -1, typeof (actuatorJson.actuatorName) === 'string' ? actuatorJson.actuatorName : "", typeof (actuatorJson.timeStamp) === 'number' ? actuatorJson.timeStamp : unixNow, typeof (actuatorJson.timesPerDay) === 'number' ? actuatorJson.timesPerDay : 0, typeof (actuatorJson.toggleCommand) === 'object' ? actuatorJson.toggleCommand : null, typeof (actuatorJson.motorCommand) === 'object' ? actuatorJson.motorCommand : null);
    }
}
exports.ActuatorCommandDTO = ActuatorCommandDTO;
//# sourceMappingURL=actuatorDto.js.map