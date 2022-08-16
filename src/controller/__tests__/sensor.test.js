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
const commandFacade_1 = __importDefault(require("../commandFacade"));
const queryFacade_1 = __importDefault(require("../queryFacade"));
const testcases_json_1 = __importDefault(require("./testcases.json"));
const databaseErrorEvent_1 = __importDefault(require("../../model/v1/events/databaseErrorEvent"));
const constants_1 = require("../../constants");
const testSetup_1 = __importDefault(require("../../utility/testSetup"));
describe("Test sensor actions - Integration test", () => {
    const setup = new testSetup_1.default();
    const timeOut = testSetup_1.default.TIME_OUT;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.init();
        for (const val of testcases_json_1.default.sensors) {
            const event = yield commandFacade_1.default.sensor.addSensor(setup.getAccessToken(), val);
            if (constants_1.TEST_SETUP_THROWS_ERROR && event instanceof databaseErrorEvent_1.default)
                throw new Error("An error is raised: " + event.content.error);
        }
        for (const val of testcases_json_1.default.sensorData) {
            const event = yield commandFacade_1.default.sensor.addSensorData(setup.getAccessToken(), val.sensorName, val);
            if (constants_1.TEST_SETUP_THROWS_ERROR && event instanceof databaseErrorEvent_1.default)
                throw new Error("An error is raised: " + event.content.error);
        }
    }), timeOut * Math.max(testcases_json_1.default.sensorData.length, testcases_json_1.default.sensors.length));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.tearDown();
    }), timeOut * (testcases_json_1.default.sensorData.length + testcases_json_1.default.sensors.length) / 2);
    const sensorRead = queryFacade_1.default.sensor;
    test("should read all sensors from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield sensorRead.getSensors(setup.getAccessToken());
        testcases_json_1.default.sensors.map((sensor, index) => {
            expect(result[index].toJson()).toStrictEqual(sensor);
        });
    }), timeOut);
    test("should read sensors by type from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const type = "Temperature";
        const result = yield sensorRead.getCategorizedSensors(setup.getAccessToken(), type);
        if (!Array.isArray(result))
            throw new Error("Wrong type");
        let index = 0;
        testcases_json_1.default.sensors.map(sensor => {
            if (sensor.type != type)
                return;
            expect(result[index++].toJson()).toStrictEqual(sensor);
        });
    }), timeOut);
    test("should read sensor by name from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomIndex = Math.round(Math.random() * (testcases_json_1.default.sensors.length - 1));
        const name = testcases_json_1.default.sensors[randomIndex].name;
        const result = yield sensorRead.getCategorizedSensors(setup.getAccessToken(), name);
        if (result.length != 1)
            throw new Error("Wrong type");
        expect(result[0].toJson()).toStrictEqual(testcases_json_1.default.sensors[randomIndex]);
    }), timeOut);
    test("should get sensor data by name to the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const name = "Temperature 9";
        const result = yield sensorRead.getSensorData(setup.getAccessToken(), name);
        let index = 0;
        testcases_json_1.default.sensorData.map(data => {
            if (data.sensorName != name)
                return;
            expect(result[index++].toJson()).toStrictEqual(data);
        });
    }), timeOut);
});
//# sourceMappingURL=sensor.test.js.map