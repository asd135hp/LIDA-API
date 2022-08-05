import CommandFacade from "../commandFacade"
import TestSetup from "../../utility/testSetup";
import QueryFacade from "../queryFacade";

describe("Test system command as a whole", ()=>{
  const setup = new TestSetup()
  const timeOut = TestSetup.TIME_OUT;
  
  beforeAll(async () => {
    await setup.init()
  }, timeOut * 2)

  afterAll(async () => {
    await setup.tearDown()
  }, timeOut)

  // all tests return false for all 

  test("Should start the system", async ()=>{
    await CommandFacade.systemCommand.startSystem(setup.getAccessToken())
    const commands = await QueryFacade.systemCommand.getSystemCommands(setup.getAccessToken())
    expect(commands.isStart).toBe(true)
    expect(commands.isStop).toBe(false)
    expect(commands.isPause).toBe(false)
    expect(commands.isRestart).toBe(false)
  })
  
  test("Should stop the system", async ()=>{
    await CommandFacade.systemCommand.stopSystem(setup.getAccessToken())
    const commands = await QueryFacade.systemCommand.getSystemCommands(setup.getAccessToken())
    expect(commands.isStart).toBe(false)
    expect(commands.isStop).toBe(true)
    expect(commands.isPause).toBe(false)
    expect(commands.isRestart).toBe(false)
  })
  
  test("Should pause the system", async ()=>{
    await CommandFacade.systemCommand.pauseSystem(setup.getAccessToken())
    const commands = await QueryFacade.systemCommand.getSystemCommands(setup.getAccessToken())
    expect(commands.isStart).toBe(false)
    expect(commands.isStop).toBe(false)
    expect(commands.isPause).toBe(true)
    expect(commands.isRestart).toBe(false)
  })
  
  test("Should restart the system", async ()=>{
    await CommandFacade.systemCommand.restartSystem(setup.getAccessToken())
    const commands = await QueryFacade.systemCommand.getSystemCommands(setup.getAccessToken())
    expect(commands.isStart).toBe(false)
    expect(commands.isStop).toBe(false)
    expect(commands.isPause).toBe(false)
    expect(commands.isRestart).toBe(true)
  })
})