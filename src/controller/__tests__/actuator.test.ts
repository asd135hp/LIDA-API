import CommandFacade from "../commandFacade";
import QueryFacade from "../queryFacade"
import testCase from "./testcases.json"
import DatabaseErrorEvent from "../../model/v1/events/databaseErrorEvent";
import FirebaseFirestoreService from "../database/firebase/services/firebaseFirestoreService";
import { persistentFirebaseConnection } from "../v1/services/firebaseFreetier/firebaseService";
import { logger, TEST_SETUP_THROWS_ERROR } from "../../constants";
import TestSetup from "../../utility/testSetup";
import { ActuatorConfigDTO } from "../../model/v1/read/actuatorDto";

describe("Test actuator actions - Integration test", ()=>{
  const setup = new TestSetup()
  const timeOut = TestSetup.TIME_OUT;
  
  beforeAll(async ()=>{
    setup.init()

    // primitive testing
    // for(const val of testCase.actuators) {
    //   const event = await CommandFacade.actuator.addActuator(setup.getAccessToken(), val)
    //   if(TEST_SETUP_THROWS_ERROR && event instanceof DatabaseErrorEvent)
    //     throw new Error("An error is raised: " + event.content.error)
    // }

    // for(const val of testCase.actuatorConfigs) {
    //   const event = await CommandFacade.actuator.updateActuatorConfig(
    //     setup.getAccessToken(),
    //     val.actuatorName,
    //     val
    //   )
    //   const proposedEvent = await CommandFacade.actuator.updateProposedActuatorConfig(
    //     setup.getAccessToken(),
    //     val.actuatorName,
    //     val
    //   )
      
    //   if(TEST_SETUP_THROWS_ERROR
    //   && event instanceof DatabaseErrorEvent
    //   && proposedEvent instanceof DatabaseErrorEvent)
    //     throw new Error("An error is raised: " + event.content.error)
    // }


  }, timeOut * (Math.max(testCase.actuatorConfigs.length, testCase.actuators.length) + 5))

  afterAll(async ()=>{
    // const fs = persistentFirebaseConnection.firestoreService as FirebaseFirestoreService
    // const rt = persistentFirebaseConnection.realtimeService

    // await fs.deleteCollection("actuators");
    // await fs.deleteCollection("actuatorCommand");
    // await rt.deleteContent("actuators")
    // await rt.deleteContent("actuatorCommand")
    // await rt.deleteContent("actuatorCommandId")
    
    await setup.tearDown()
  }, timeOut * 5)
  
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

  // actuator config

  const on2_check = (list: ActuatorConfigDTO[], other_list: any[]) =>
    list.map(dto => {
      const temp = other_list.find(val => val.actuatorName === dto.actuatorName)
      if(!temp || temp.timeStamp !== dto.timeStamp) return false
      if(temp.toggleConfig) {
        expect(temp.toggleConfig).toStrictEqual(dto.toggleConfig)
        return true
      }
      if(temp.motorConfig && temp.timesPerDay) {
        expect(temp.motorConfig).toStrictEqual(dto.motorConfig)
        expect(temp.timesPerDay).toBe(dto.timesPerDay)
        return true
      }
      return false
    }).filter(x => x).length === list.length

  test("should get actuator configurations from the database", async ()=>{
    const result = await actuatorRead.getActuatorConfigs(setup.getAccessToken())
    expect(on2_check(result, testCase.actuatorConfigs)).toBe(true)
  }, timeOut)

  test("should get actuator configurations from the database", async ()=>{
    const result = await actuatorRead.getProposedActuatorConfigs(setup.getAccessToken())
    expect(on2_check(result, testCase.actuatorConfigs)).toBe(true)
  }, timeOut)
})