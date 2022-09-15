"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorDataDTO = exports.SensorDTO = void 0;
const luxon_1 = require("luxon");
const constants_1 = require("../../../constants");
class SensorDTO {
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
    static fromJson(sensorJson) {
        return new SensorDTO(typeof (sensorJson.name) === 'string' ? sensorJson.name : "", typeof (sensorJson.type) === 'string' ? sensorJson.type : "", typeof (sensorJson.isRunning) === 'boolean' ? sensorJson.isRunning : true);
    }
}
exports.SensorDTO = SensorDTO;
class SensorDataDTO {
    constructor(sensorName, value, timeStamp) {
        this.sensorName = sensorName;
        this.value = value;
        this.timeStamp = timeStamp;
    }
    toJson() {
        return {
            sensorName: this.sensorName,
            value: this.value,
            timeStamp: this.timeStamp
        };
    }
    static fromJson(sensorJson) {
        const unixNow = luxon_1.DateTime.now().setZone(constants_1.DATABASE_TIMEZONE).toUnixInteger();
        return new SensorDataDTO(typeof (sensorJson.sensorName) === 'string' ? sensorJson.sensorName : '', typeof (sensorJson.value) === 'number' ? sensorJson.value : -1, typeof (sensorJson.timeStamp) === 'number' ? sensorJson.timeStamp : unixNow);
    }
}
exports.SensorDataDTO = SensorDataDTO;
//# sourceMappingURL=sensorDto.js.map