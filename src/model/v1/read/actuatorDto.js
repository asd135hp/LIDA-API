"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActuatorConfigDTO = exports.ActuatorConfigType = exports.ActuatorDTO = void 0;
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
var ActuatorConfigType;
(function (ActuatorConfigType) {
    ActuatorConfigType[ActuatorConfigType["TOGGLE"] = 0] = "TOGGLE";
    ActuatorConfigType[ActuatorConfigType["MOTOR"] = 1] = "MOTOR";
    ActuatorConfigType[ActuatorConfigType["NONE"] = 2] = "NONE";
})(ActuatorConfigType = exports.ActuatorConfigType || (exports.ActuatorConfigType = {}));
class ActuatorConfigDTO {
    constructor(actuatorName, timeStamp, timesPerDay, toggleConfig, motorConfig) {
        this.actuatorName = actuatorName;
        this.timeStamp = timeStamp;
        this.toggleConfig = toggleConfig;
        this.motorConfig = motorConfig;
        this.timesPerDay = timesPerDay;
        if ((timesPerDay === 0 || !motorConfig) && toggleConfig)
            this.type = ActuatorConfigType.TOGGLE;
        else if (!toggleConfig && timesPerDay > 0 && motorConfig)
            this.type = ActuatorConfigType.MOTOR;
        else
            this.type = ActuatorConfigType.NONE;
    }
    toJson() {
        const json = {
            actuatorName: this.actuatorName,
            timeStamp: this.timeStamp,
            timesPerDay: this.timesPerDay,
            type: this.type
        };
        if (!this.motorConfig)
            json.toggleConfig = this.toggleConfig;
        if (!this.toggleConfig)
            json.motorConfig = this.motorConfig;
        return json;
    }
    static fromJson(actuatorJson) {
        const unixNow = luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger();
        return new ActuatorConfigDTO(typeof (actuatorJson.actuatorName) === 'string' ? actuatorJson.actuatorName : "", typeof (actuatorJson.timeStamp) === 'number' ? actuatorJson.timeStamp : unixNow, typeof (actuatorJson.timesPerDay) === 'number' ? actuatorJson.timesPerDay : 0, typeof (actuatorJson.toggleConfig) === 'object' ? actuatorJson.toggleConfig : null, typeof (actuatorJson.motorConfig) === 'object' ? actuatorJson.motorConfig : null);
    }
}
exports.ActuatorConfigDTO = ActuatorConfigDTO;
//# sourceMappingURL=actuatorDto.js.map