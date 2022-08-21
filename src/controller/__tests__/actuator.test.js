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
const queryFacade_1 = __importDefault(require("../queryFacade"));
const testcases_json_1 = __importDefault(require("./testcases.json"));
const testSetup_1 = __importDefault(require("../../utility/testSetup"));
describe("Test actuator actions - Integration test", () => {
    const setup = new testSetup_1.default();
    const timeOut = testSetup_1.default.TIME_OUT;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        setup.init();
    }), timeOut * Math.max(testcases_json_1.default.actuatorConfigs.length, testcases_json_1.default.actuators.length));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.tearDown();
    }), timeOut * 4);
    const actuatorRead = queryFacade_1.default.actuator;
    test("should read all actuators from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = (yield actuatorRead.getActuators(setup.getAccessToken())).map(a => a.toJson());
        expect(testcases_json_1.default.actuators).toStrictEqual(result);
    }), timeOut);
    test("should read actuators by type from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const type = "Air pump";
        const result = yield actuatorRead.getCategorizedActuators(setup.getAccessToken(), type);
        if (!result || !Array.isArray(result))
            throw new Error("Wrong type");
        let index = 0;
        testcases_json_1.default.actuators.map(actuator => {
            if (actuator.type != type)
                return;
            expect(result[index++].toJson()).toStrictEqual(actuator);
        });
    }), timeOut);
    test("should read actuator by name from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomIndex = Math.round(Math.random() * (testcases_json_1.default.actuators.length - 1));
        const name = testcases_json_1.default.actuators[randomIndex].name;
        const result = yield actuatorRead.getCategorizedActuators(setup.getAccessToken(), name);
        if (result.length != 1)
            throw new Error("Wrong type");
        expect(result[0].toJson()).toStrictEqual(testcases_json_1.default.actuators[randomIndex]);
    }), timeOut);
    const on2_check = (list, other_list) => list.map(dto => {
        const temp = other_list.find(val => val.actuatorName === dto.actuatorName);
        if (!temp || temp.timeStamp !== dto.timeStamp)
            return false;
        if (temp.toggleConfig) {
            expect(temp.toggleConfig).toStrictEqual(dto.toggleConfig);
            return true;
        }
        if (temp.motorConfig && temp.timesPerDay) {
            expect(temp.motorConfig).toStrictEqual(dto.motorConfig);
            expect(temp.timesPerDay).toBe(dto.timesPerDay);
            return true;
        }
        return false;
    }).filter(x => x).length === list.length;
    test("should get actuator configurations from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield actuatorRead.getActuatorConfigs(setup.getAccessToken());
        expect(on2_check(result, testcases_json_1.default.actuatorConfigs)).toBe(true);
    }), timeOut);
    test("should get actuator configurations from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield actuatorRead.getProposedActuatorConfigs(setup.getAccessToken());
        expect(on2_check(result, testcases_json_1.default.actuatorConfigs)).toBe(true);
    }), timeOut);
});
//# sourceMappingURL=actuator.test.js.map