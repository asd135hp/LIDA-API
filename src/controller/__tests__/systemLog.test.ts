import CommandFacade from "../commandFacade";
import QueryFacade from "../queryFacade"
import { LOG_LINES, TEST_SETUP_THROWS_ERROR } from "../../constants";
import testCase from "./testcases.json"
import DatabaseErrorEvent from "../../model/v1/events/databaseErrorEvent";
import { persistentFirebaseConnection } from "../v1/services/firebaseFreetier/firebaseService";
import { DocumentSnapshot, Transaction } from "firebase-admin/firestore";
import TestSetup from "../../utility/testSetup";

describe("Test sensor actions - Integration test", ()=>{
  const setup = new TestSetup()
  const timeOut = TestSetup.TIME_OUT

  const deleteLogs = async(snapshot: DocumentSnapshot, t: Transaction) => {
    const docs = await snapshot.ref.collection("content").listDocuments()
    for(const doc of docs) t.delete(doc)
  }

  beforeAll(async ()=>{
    await setup.init()

    for(const val of testCase.sensorLogs) {
      const event = await CommandFacade.logs.addSensorLog(setup.getAccessToken(), val)
      if(TEST_SETUP_THROWS_ERROR && event instanceof DatabaseErrorEvent)
        throw new Error("An error is raised: " + event.content.error)
    }

    for(const val of testCase.actuatorLogs) {
      const event = await CommandFacade.logs.addActuatorLog(setup.getAccessToken(), val)
      if(TEST_SETUP_THROWS_ERROR && event instanceof DatabaseErrorEvent)
        throw new Error("An error is raised: " + event.content.error)
    }
  }, timeOut * Math.max(testCase.sensorLogs.length, testCase.actuatorLogs.length))

  afterAll(async ()=>{
    await persistentFirebaseConnection.firestoreService.runTransaction("logs/sensor", deleteLogs)
    await persistentFirebaseConnection.firestoreService.runTransaction("logs/actuator", deleteLogs)

    await persistentFirebaseConnection.realtimeService.deleteContent("logs")

    await setup.tearDown()
  }, timeOut * 4)

  const logsRead = QueryFacade.logs

  test("should read all sensor logs form the database", async ()=>{
    const result = await logsRead.getSensorLogs(setup.getAccessToken())
    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(LOG_LINES)
  }, timeOut)

  test("should read all actuator logs form the database", async ()=>{
    const result = await logsRead.getActuatorLogs(setup.getAccessToken())
    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(LOG_LINES)
  }, timeOut)
})