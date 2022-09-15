"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEachSensorLatestData = void 0;
function getEachSensorLatestData(rawData) {
    const dict = {};
    const result = [];
    rawData.map(dto => {
        const val = dict[dto.sensorName];
        if (!val || dto.timeStamp > val.timeStamp)
            dict[dto.sensorName] = dto;
    });
    for (const name in dict)
        result.push(dict[name]);
    return result;
}
exports.getEachSensorLatestData = getEachSensorLatestData;
//# sourceMappingURL=sensorService.js.map