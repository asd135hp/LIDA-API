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
const testSetup_1 = __importDefault(require("../../utility/testSetup"));
const queryFacade_1 = __importDefault(require("../queryFacade"));
describe("Test system command as a whole", () => {
    const setup = new testSetup_1.default();
    const timeOut = testSetup_1.default.TIME_OUT;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.init();
    }), timeOut * 5);
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield setup.tearDown();
    }), timeOut * 5);
    test("Should start the system", () => __awaiter(void 0, void 0, void 0, function* () {
        yield commandFacade_1.default.systemCommand.startSystem(setup.getAccessToken());
        const commands = yield queryFacade_1.default.systemCommand.getProposedSystemCommands(setup.getAccessToken());
        expect(commands.isStart).toBe(true);
        expect(commands.isStop).toBe(false);
        expect(commands.isPause).toBe(false);
        expect(commands.isRestart).toBe(false);
    }), timeOut);
    test("Should stop the system", () => __awaiter(void 0, void 0, void 0, function* () {
        yield commandFacade_1.default.systemCommand.stopSystem(setup.getAccessToken());
        const commands = yield queryFacade_1.default.systemCommand.getProposedSystemCommands(setup.getAccessToken());
        expect(commands.isStart).toBe(false);
        expect(commands.isStop).toBe(true);
        expect(commands.isPause).toBe(false);
        expect(commands.isRestart).toBe(false);
    }), timeOut);
    test("Should pause the system", () => __awaiter(void 0, void 0, void 0, function* () {
        yield commandFacade_1.default.systemCommand.pauseSystem(setup.getAccessToken());
        const commands = yield queryFacade_1.default.systemCommand.getProposedSystemCommands(setup.getAccessToken());
        expect(commands.isStart).toBe(false);
        expect(commands.isStop).toBe(false);
        expect(commands.isPause).toBe(true);
        expect(commands.isRestart).toBe(false);
    }), timeOut);
    test("Should restart the system", () => __awaiter(void 0, void 0, void 0, function* () {
        yield commandFacade_1.default.systemCommand.restartSystem(setup.getAccessToken());
        const commands = yield queryFacade_1.default.systemCommand.getProposedSystemCommands(setup.getAccessToken());
        expect(commands.isStart).toBe(false);
        expect(commands.isStop).toBe(false);
        expect(commands.isPause).toBe(false);
        expect(commands.isRestart).toBe(true);
    }), timeOut);
});
//# sourceMappingURL=systemCommand.test.js.map