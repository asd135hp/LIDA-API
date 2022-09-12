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
const testSetup_1 = __importDefault(require("../../utility/testSetup"));
const testcases_json_1 = __importDefault(require("./testcases.json"));
xdescribe("Data saving test - Integration test", () => {
    const setup = new testSetup_1.default();
    const timeOut = testSetup_1.default.TIME_OUT;
    const templateStartDate = 1609459200;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.init();
    }), timeOut * (testcases_json_1.default.dataSaving.sensor.length + testcases_json_1.default.dataSaving.logs.length + 5));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.tearDown();
    }), timeOut * 5);
    test("", () => { });
});
//# sourceMappingURL=dataSaving.test.js.map