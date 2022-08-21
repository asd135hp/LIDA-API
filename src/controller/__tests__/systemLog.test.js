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
const constants_1 = require("../../constants");
const testcases_json_1 = __importDefault(require("./testcases.json"));
const testSetup_1 = __importDefault(require("../../utility/testSetup"));
describe("Test sensor actions - Integration test", () => {
    const setup = new testSetup_1.default();
    const timeOut = testSetup_1.default.TIME_OUT;
    const deleteLogs = (snapshot, t) => __awaiter(void 0, void 0, void 0, function* () {
        const docs = yield snapshot.ref.collection("content").listDocuments();
        for (const doc of docs)
            t.delete(doc);
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.init();
    }), timeOut * Math.max(testcases_json_1.default.sensorLogs.length, testcases_json_1.default.actuatorLogs.length));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.tearDown();
    }), timeOut * 4);
    const logsRead = queryFacade_1.default.logs;
    test("should read all sensor logs form the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield logsRead.getSensorLogs(setup.getAccessToken());
        expect(result.length).toBeGreaterThan(0);
        expect(result.length).toBeLessThanOrEqual(constants_1.LOG_LINES);
    }), timeOut);
    test("should read all actuator logs form the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield logsRead.getActuatorLogs(setup.getAccessToken());
        expect(result.length).toBeGreaterThan(0);
        expect(result.length).toBeLessThanOrEqual(constants_1.LOG_LINES);
    }), timeOut);
});
//# sourceMappingURL=systemLog.test.js.map