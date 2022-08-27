import apiSetup from "../apiSetup";
import { TEST_ACCOUNT } from "../constants";
import QueryFacade from "../controller/queryFacade";
import User from "../model/v1/auth/user";
import { setTimeout } from "timers/promises";
import { persistentFirebaseConnection } from "../controller/v1/services/firebaseFreetier/firebaseService";
import { asymmetricKeyDecryption } from "./encryption";

export default class TestSetup {
  private closeHandler: Function = null
  private prevEnv: string = process.env.NODE_ENV
  private user: User = null
  static TIME_OUT: number = 5000

  async init() {
    const { email, password } = TEST_ACCOUNT

    this.prevEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'test'
    this.closeHandler = apiSetup(null);

    // register and login
    await QueryFacade.security.register(email, password).then(async ()=>await setTimeout(2000), ()=>{})
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
    await persistentFirebaseConnection.authService.deleteUser(uid, apiKey)
    this.closeHandler?.call(null);
  }
}