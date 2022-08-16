"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const databaseErrorEvent_1 = __importDefault(require("../../model/v1/events/databaseErrorEvent"));
const binarySearch_1 = __importDefault(require("../../utility/binarySearch"));
const helper_1 = require("../../utility/helper");
const testSetup_1 = __importDefault(require("../../utility/testSetup"));
const commandFacade_1 = __importDefault(require("../commandFacade"));
const queryFacade_1 = __importDefault(require("../queryFacade"));
const dataSavingService_1 = __importDefault(require("../v1/services/firebaseFreetier/dataSavingService"));
const testcases_json_1 = __importDefault(require("./testcases.json"));
describe("Data saving test - Integration test", () => {
    const setup = new testSetup_1.default();
    const timeOut = testSetup_1.default.TIME_OUT;
    const templateStartDate = 1609459200;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.init();
        let [startDate, unixDay] = [templateStartDate, 3600 * 24];
        constants_1.logger.info("Uploading data to the server");
        for (const dataByDay of testcases_json_1.default.dataSaving.sensor) {
            const event = yield commandFacade_1.default.dataSaving.saveSensorSnapshot(setup.getAccessToken(), JSON.stringify(dataByDay.sensor), JSON.stringify(dataByDay.sensorData), startDate, startDate += unixDay);
            if (constants_1.TEST_SETUP_THROWS_ERROR && event instanceof databaseErrorEvent_1.default)
                throw new Error("An error is raised: " + event.content.error);
        }
        startDate = templateStartDate;
        for (const dataByDay of testcases_json_1.default.dataSaving.logs) {
            const event = yield commandFacade_1.default.dataSaving.saveLogSnapshot(setup.getAccessToken(), JSON.stringify(dataByDay.actuator), JSON.stringify(dataByDay.sensor), startDate, startDate += unixDay);
            if (constants_1.TEST_SETUP_THROWS_ERROR && event instanceof databaseErrorEvent_1.default)
                throw new Error("An error is raised: " + event.content.error);
        }
    }), timeOut * (testcases_json_1.default.dataSaving.sensor.length + testcases_json_1.default.dataSaving.logs.length));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.tearDown();
    }), timeOut * 2);
    const dataSaving = queryFacade_1.default.dataSaving;
    const startDate = templateStartDate + 0;
    const days = 2;
    const unixOffset = days * 24 * 3600;
    test(`Should get ${days} days worth of sensor snapshots`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield dataSaving.retrieveSensorSnapshots(setup.getAccessToken(), startDate, startDate + unixOffset);
        result.map((dataByDay, index) => {
            const currentSensorSs = testcases_json_1.default.dataSaving.sensor[index];
            currentSensorSs.sensor = currentSensorSs.sensor.sort((0, helper_1.orderByProp)("name"));
            dataByDay.sensor.map((sensor) => {
                expect((0, binarySearch_1.default)(currentSensorSs.sensor, sensor, {
                    compareFcn: (0, helper_1.orderByProp)("name")
                }).match.isNone()).toBe(false);
            });
            currentSensorSs.sensorData = currentSensorSs.sensorData.sort((0, helper_1.orderByProp)("timeStamp"));
            dataByDay.sensorData.map((sensorData) => {
                expect((0, binarySearch_1.default)(currentSensorSs.sensorData, sensorData, {
                    compareFcn: (a, b) => {
                        const byTimeStamp = (0, helper_1.orderByProp)("timeStamp")(a, b);
                        if (byTimeStamp == 0) {
                            const bySensorName = (0, helper_1.orderByProp)("sensorName")(a, b);
                            return bySensorName == 0 ? (0, helper_1.orderByProp)("value")(a, b) : bySensorName;
                        }
                        return byTimeStamp;
                    }
                }).match.isNone()).toBe(false);
            });
        });
    }), timeOut * days);
    test(`Should get ${days} days worth of logs snapshots`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield dataSaving.retrieveLogSnapshots(setup.getAccessToken(), startDate, startDate + unixOffset);
        result.map((dataByDay, index) => {
            const currentLogSnapshot = testcases_json_1.default.dataSaving.logs[index];
            expect(dataByDay.sensor).toStrictEqual(currentLogSnapshot.sensor.sort((0, helper_1.orderByProp)("timeStamp")));
            expect(dataByDay.actuator).toStrictEqual(currentLogSnapshot.actuator.sort((0, helper_1.orderByProp)("timeStamp")));
        });
    }), timeOut * days);
    test(`Should get ${days} days worth of sensor data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new dataSavingService_1.default();
        const sensorName = "Temperature12";
        const option = yield service.retrieveSensorDataFromSnapshots({
            startDate,
            endDate: startDate + unixOffset
        }, data => data.sensorName == sensorName);
        const result = option.unwrapOr([]);
        testcases_json_1.default.dataSaving.sensor.map(dailySnapshot => dailySnapshot.sensorData.map(data => {
            if (data.sensorName == sensorName)
                expect((0, binarySearch_1.default)(result, data, {
                    compareFcn: (0, helper_1.orderByProp)("sensorName")
                }).match.isNone()).toBe(false);
        }));
    }), timeOut * days);
});
//# sourceMappingURL=dataSaving.test.js.map