import CommandFacade from "../commandFacade";
import QueryFacade from "../queryFacade"
import testCase from "./testcases.json"
import DatabaseErrorEvent from "../../model/v1/events/databaseErrorEvent";
import FirebaseFirestoreService from "../database/firebase/services/firebaseFirestoreService";
import { persistentFirebaseConnection } from "../v1/services/firebaseFreetier/firebaseService";
import { TEST_SETUP_THROWS_ERROR } from "../../constants";
import User from "../../model/v1/auth/user";
import TestSetup from "../../utility/testSetup";

describe("Test sensor actions - Integration test", ()=>{
  const setup = new TestSetup()
  const timeOut = TestSetup.TIME_OUT;
  
  beforeAll(async ()=>{
    await setup.init()

    // primitive testing
    for(const val of testCase.sensors) {
      const event = await CommandFacade.sensor.addSensor(setup.getAccessToken(), val)
      if(TEST_SETUP_THROWS_ERROR && event instanceof DatabaseErrorEvent)
        throw new Error("An error is raised: " + event.content.error)
    }

    for(const val of testCase.sensorData) {
      const event = await CommandFacade.sensor.addSensorData(setup.getAccessToken(), val.sensorName, val)
      if(TEST_SETUP_THROWS_ERROR && event instanceof DatabaseErrorEvent)
        throw new Error("An error is raised: " + event.content.error)
    }
  }, timeOut * Math.max(testCase.sensorData.length, testCase.sensors.length))

  afterAll(async ()=>{
    // const fs = persistentFirebaseConnection.firestoreService as FirebaseFirestoreService
    // const rt = persistentFirebaseConnection.realtimeService

    // await fs.deleteCollection("sensors");
    // await fs.deleteCollection("sensorData");
    // await rt.deleteContent("sensors")
    // await rt.deleteContent("sensorData")
    
    await setup.tearDown()
  }, timeOut * (testCase.sensorData.length + testCase.sensors.length) / 2)

  const sensorRead = QueryFacade.sensor

  // sensors
  test("should read all sensors from the database", async ()=>{
    const result = await sensorRead.getSensors(setup.getAccessToken())
    testCase.sensors.map((sensor, index) => {
      expect(result[index].toJson()).toStrictEqual(sensor)
    })
  }, timeOut)

  test("should read sensors by type from the database", async ()=>{
    const type = "Temperature"
    const result = await sensorRead.getCategorizedSensors(setup.getAccessToken(), type)
    if(!Array.isArray(result)) throw new Error("Wrong type")
    let index = 0
    testCase.sensors.map(sensor => {
      if(sensor.type != type) return
      expect(result[index++].toJson()).toStrictEqual(sensor)
    })
  }, timeOut)

  test("should read sensor by name from the database", async ()=>{
    const randomIndex = Math.round(Math.random() * (testCase.sensors.length - 1))
    const name = testCase.sensors[randomIndex].name
    const result = await sensorRead.getCategorizedSensors(setup.getAccessToken(), name)
    if(result.length != 1) throw new Error("Wrong type")
    expect(result[0].toJson()).toStrictEqual(testCase.sensors[randomIndex])
  }, timeOut)

  // sensor data

  test("should get sensor data by name to the database", async ()=>{
    const name = "Temperature 9"
    const result = await sensorRead.getSensorData(setup.getAccessToken(), name)
    let index = 0
    testCase.sensorData.map(data => {
      if(data.sensorName != name) return
      expect(result[index++].toJson()).toStrictEqual(data)
    })
  }, timeOut)
})