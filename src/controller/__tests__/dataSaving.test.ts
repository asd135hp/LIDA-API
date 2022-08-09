import { logger, TEST_ACCOUNT, TEST_SETUP_THROWS_ERROR } from "../../constants";
import DatabaseErrorEvent from "../../model/v1/events/databaseErrorEvent";
import binarySearch from "../../utility/binarySearch";
import { orderByProp } from "../../utility/helper";
import TestSetup from "../../utility/testSetup";
import CommandFacade from "../commandFacade";
import QueryFacade from "../queryFacade";
import DataSavingService from "../v1/services/firebaseFreetier/dataSavingService";
import { persistentFirebaseConnection } from "../v1/services/firebaseFreetier/firebaseService";
import testCase from "./testcases.json"

describe("Data saving test - Integration test", ()=>{
  const setup = new TestSetup()
  const timeOut = TestSetup.TIME_OUT

  const templateStartDate = 1609459200
  beforeAll(async ()=>{
    await setup.init()

    // primitive testing
    // let [startDate, unixDay] = [templateStartDate, 3600 * 24];
    // logger.info("Uploading data to the server")
    // for(const dataByDay of testCase.dataSaving.sensor){
    //   const event = await CommandFacade.dataSaving.saveSensorSnapshot(
    //     setup.getAccessToken(),
    //     JSON.stringify(dataByDay.sensor), JSON.stringify(dataByDay.sensorData),
    //     startDate, startDate += unixDay
    //   )
    //   if(TEST_SETUP_THROWS_ERROR && event instanceof DatabaseErrorEvent)
    //     throw new Error("An error is raised: " + event.content.error)
    // }

    // startDate = templateStartDate
    // for(const dataByDay of testCase.dataSaving.logs){
    //   const event = await CommandFacade.dataSaving.saveLogSnapshot(
    //     setup.getAccessToken(), 
    //     JSON.stringify(dataByDay.actuator), JSON.stringify(dataByDay.sensor),
    //     startDate, startDate += unixDay
    //   )
    //   if(TEST_SETUP_THROWS_ERROR && event instanceof DatabaseErrorEvent)
    //     throw new Error("An error is raised: " + event.content.error)
    // }
  }, timeOut * (testCase.dataSaving.sensor.length + testCase.dataSaving.logs.length))

  afterAll(async ()=>{
    // await persistentFirebaseConnection.storageService.deleteFolderFromStorage("")
    await setup.tearDown()
  }, timeOut * 2)

  const dataSaving = QueryFacade.dataSaving

  const startDate = templateStartDate + 0
  const days = 2
  const unixOffset = days * 24 * 3600

  test(`Should get ${days} days worth of sensor snapshots`, async ()=>{
    const result = await dataSaving.retrieveSensorSnapshots(setup.getAccessToken(), startDate, startDate + unixOffset)
    result.map((dataByDay, index) => {
      const currentSensorSs = testCase.dataSaving.sensor[index]
      
      currentSensorSs.sensor = currentSensorSs.sensor.sort(orderByProp("name"))
      dataByDay.sensor.map((sensor: any) => {
        expect(binarySearch(currentSensorSs.sensor, sensor, {
          compareFcn: orderByProp("name")
        }).match.isNone()).toBe(false)
      })

      currentSensorSs.sensorData = currentSensorSs.sensorData.sort(orderByProp("timeStamp"))
      dataByDay.sensorData.map((sensorData: any) => {
        expect(binarySearch(currentSensorSs.sensorData, sensorData, {
          compareFcn: (a, b) => {
            const byTimeStamp = orderByProp("timeStamp")(a, b)
            if(byTimeStamp == 0) {
              // undecided between timestamps
              const bySensorName = orderByProp("sensorName")(a, b)
              // undecided between sensor names (which shouldn't be the case but oh well)
              return bySensorName == 0 ? orderByProp("value")(a, b) : bySensorName
            }
            return byTimeStamp
          }
        }).match.isNone()).toBe(false)
      })
    })
  }, timeOut * days)

  test(`Should get ${days} days worth of logs snapshots`, async ()=>{
    const result = await dataSaving.retrieveLogSnapshots(setup.getAccessToken(), startDate, startDate + unixOffset)
    result.map((dataByDay, index) => {
      const currentLogSnapshot = testCase.dataSaving.logs[index]
      expect(dataByDay.sensor).toStrictEqual(currentLogSnapshot.sensor.sort(orderByProp("timeStamp")))
      expect(dataByDay.actuator).toStrictEqual(currentLogSnapshot.actuator.sort(orderByProp("timeStamp")))
    })
  }, timeOut * days)

  test(`Should get ${days} days worth of sensor data`, async ()=>{
    const service = new DataSavingService()
    const sensorName = "Temperature12"
    const option = await service.retrieveSensorDataFromSnapshots({
      startDate,
      endDate: startDate + unixOffset
    }, data => data.sensorName == sensorName)
    const result = option.unwrapOr([])

    // simulate exactly how the method should works
    testCase.dataSaving.sensor.map(
      dailySnapshot => dailySnapshot.sensorData.map(data => {
        if(data.sensorName == sensorName)
          expect(binarySearch(result, data, {
            compareFcn: orderByProp("sensorName")
          }).match.isNone()).toBe(false)
      })
    )
  }, timeOut * days)
})