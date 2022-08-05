import { Route, SuccessResponse, Response, Controller, Security, Query, Post } from "tsoa";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import SystemCommandService from "../../services/firebaseFreetier/systemCommandService";

@Security("api_key")
@Route(`api/v1/systemCommand`)
@SuccessResponse(200, "Ok")
@Response(403, "Forbidden")
@Response(404, "Not Found")
@Response(408, "Request Timeout")
export class SystemCommandWriteMethods extends Controller {
  static mainService: SystemCommandService;
  
  private service: SystemCommandService;

  constructor(){
    super()
    this.service = SystemCommandWriteMethods.mainService
  }

  @Post("startSystem")
  async startSystem(@Query() accessToken: string): Promise<DatabaseEvent> {
    return await this.service.setStartSystem()
  }
  
  @Post("pauseSystem")
  async pauseSystem(@Query() accessToken: string): Promise<DatabaseEvent> {
    return await this.service.setPauseSystem()
  }
  
  @Post("stopSystem")
  async stopSystem(@Query() accessToken: string): Promise<DatabaseEvent> {
    return await this.service.setStopSystem()
  }
  
  @Post("restartSystem")
  async restartSystem(@Query() accessToken: string): Promise<DatabaseEvent> {
    return await this.service.setRestartSystem()
  }
}