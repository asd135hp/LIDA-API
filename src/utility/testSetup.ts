import apiSetup from "../apiSetup";
import { logger, TEST_ACCOUNT } from "../constants";
import QueryFacade from "../controller/queryFacade";
import User from "../model/v1/auth/user";
import { setTimeout } from "timers/promises";
import { asymmetricKeyDecryption } from "./encryption";
import winston from "winston";
import { persistentAuthService } from "../controller/v1/services/serviceEntries";

export default class TestSetup {
  private closeHandler: Function = null
  private prevEnv: string = process.env.NODE_ENV
  private user: User = null
  static TIME_OUT: number = 5000

  async init() {
    const { email, password } = TEST_ACCOUNT

    this.prevEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'test'
    this.setFileLogging()

    this.closeHandler = apiSetup(null);
    //setNewPersistentFirebaseConnection()

    // register and login
    await persistentAuthService
      .registerWithEmail(email, password)
      .then(async ()=>await setTimeout(2000), ()=>{})
    this.user = await QueryFacade.security.login(email, password).catch(()=>null)
  }

  getAccessToken() {
    let count = 0
    while(count++ < 10){
      if(!this.user) setTimeout(250).then(()=>{})
    }

    return this.user?.accessToken ?? ""
  }
  
  async tearDown() {
    process.env.NODE_ENV = this.prevEnv
    const [uid, apiKey] = asymmetricKeyDecryption(Buffer.from(this.getAccessToken(), "hex")).split("|")
    await persistentAuthService.deleteUser(uid, apiKey)
    await new Promise<string>(resolve => global.setTimeout(() => resolve(""), 500))

    this.closeHandler?.call(null);
  }

  suppressLogger() {
    while(logger.transports.length != 0) {
      const temp = logger.transports.at(-1)
      logger.remove(temp)
    }
  }

  setConsoleLogging(suppress = true) {
    suppress && this.suppressLogger()
    logger.add(
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.prettyPrint({ colorize: true }),
          winston.format.simple()
        ),
      })
    )
  }

  setFileLogging(suppress = true) {
    suppress && this.suppressLogger()

    logger.add(
      new winston.transports.File({
        level: "debug",
        maxFiles: 3,
        maxsize: 1024 * 1024 * 1024 * 20, // 20MB
        filename: "debug.log"
      })
    )
    logger.add(
      new winston.transports.File({
        level: "error",
        maxFiles: 3,
        maxsize: 1024 * 1024 * 512, // 512KB
        filename: "error.log"
      }),
    )
  }
}