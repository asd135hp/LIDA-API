import CommandFacade from "../commandFacade";
import QueryFacade from "../queryFacade"
import testCase from "./testcases.json"
import DatabaseErrorEvent from "../../model/v1/events/databaseErrorEvent";
import FirebaseFirestoreService from "../database/firebase/services/firebaseFirestoreService";
import { persistentFirebaseConnection } from "../v1/services/firebaseFreetier/firebaseService";
import { TEST_SETUP_THROWS_ERROR } from "../../constants";
import TestSetup from "../../utility/testSetup";

describe("Test actuator actions - Integration test", ()=>{
  const setup = new TestSetup()
  const timeOut = TestSetup.TIME_OUT;
  
  beforeAll(async ()=>{
    setup.init()

    for(const val of testCase.actuators) {
      const event = await CommandFacade.actuator.addActuator(setup.getAccessToken(), val)
      if(TEST_SETUP_THROWS_ERROR && event instanceof DatabaseErrorEvent)
        throw new Error("An error is raised: " + event.content.error)
    }

    for(const val of testCase.actuatorCommands) {
      const event = await CommandFacade.actuator.addActuatorCommand(setup.getAccessToken(), val.actuatorName, val)
      if(TEST_SETUP_THROWS_ERROR && event instanceof DatabaseErrorEvent)
        throw new Error("An error is raised: " + event.content.error)
    }
  }, timeOut * Math.max(testCase.actuatorCommands.length, testCase.actuators.length))

  afterAll(async ()=>{
    const fs = persistentFirebaseConnection.firestoreService as FirebaseFirestoreService
    const rt = persistentFirebaseConnection.realtimeService

    await fs.deleteCollection("actuators");
    await fs.deleteCollection("actuatorCommand");
    await rt.deleteContent("actuators")
    await rt.deleteContent("actuatorCommand")
    await rt.deleteContent("actuatorCommandId")
    
    await setup.tearDown()
  }, timeOut * 4)
  
  const actuatorRead = QueryFacade.actuator

  // actuators
  test("should read all actuators from the database", async ()=>{
    const result = (await actuatorRead.getActuators(setup.getAccessToken())).map(a => a.toJson())
    expect(testCase.actuators).toStrictEqual(result)
  }, timeOut)

  test("should read actuators by type from the database", async ()=>{
    const type = "Air pump"
    const result = await actuatorRead.getCategorizedActuators(setup.getAccessToken(), type)
    if(!result || !Array.isArray(result)) throw new Error("Wrong type")
    let index = 0
    testCase.actuators.map(actuator => {
      if(actuator.type != type) return
      expect(result[index++].toJson()).toStrictEqual(actuator)
    })
  }, timeOut)

  test("should read actuator by name from the database", async ()=>{
    const randomIndex = Math.round(Math.random() * (testCase.actuators.length - 1))
    const name = testCase.actuators[randomIndex].name
    const result = await actuatorRead.getCategorizedActuators(setup.getAccessToken(), name)
    if(result.length != 1) throw new Error("Wrong type")
    expect(result[0].toJson()).toStrictEqual(testCase.actuators[randomIndex])
  }, timeOut)

  // actuator data

  test("should get actuator commands from the database", async ()=>{
    const result = await actuatorRead.getActuatorCommands(setup.getAccessToken())
    expect(result.length).toBe(testCase.actuatorCommands.length)
    expect(result.length).toBeGreaterThan(0)
  }, timeOut)

  test("should resolve the oldest actuator command from the database", async ()=>{
    const result = await actuatorRead.getOldestActuatorCommand(setup.getAccessToken())
    await CommandFacade.actuator.resolveActuatorCommand(setup.getAccessToken(), result.id)

    const newCommand = await actuatorRead.getOldestActuatorCommand(setup.getAccessToken())
    expect(newCommand).not.toBe(result)

    const newCommandList = await actuatorRead.getActuatorCommands(setup.getAccessToken())
    expect(newCommandList).not.toBe(testCase.actuatorCommands.length)
  })
})