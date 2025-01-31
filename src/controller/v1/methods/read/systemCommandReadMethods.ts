import { Get, Route, SuccessResponse, Response, Controller, Security, Query } from "tsoa";
import { defaultKeySchema, logger } from "../../../../constants";
import { SystemCommandDTO } from "../../../../model/v1/read/systemCommandDto";
import { SystemCommandService } from "../../services/serviceEntries";

@Security(defaultKeySchema)
@Route(`api/v1/systemCommand`)
@SuccessResponse(200, "Ok")
@Response(403, "Forbidden")
@Response(404, "Not Found")
@Response(408, "Request Timeout")
export class SystemCommandReadMethods extends Controller {
  @Get("get")
  async getSystemCommands(@Query() accessToken: string): Promise<SystemCommandDTO> {
    logger.info("SystemCommandReadMethods: Getting system commands from the database")
    const option = await new SystemCommandService().getSystemFlags()
    return option.unwrapOrElse(()=>{
      logger.error("SystemCommandReadMethods - Something happened to either the code or the database")
      throw new Error("Internal error")
    })
  }
  
  @Get("proposed/get")
  async getProposedSystemCommands(@Query() accessToken: string): Promise<SystemCommandDTO> {
    logger.info("SystemCommandReadMethods: Getting proposed system commands from the database")
    const option = await new SystemCommandService().getProposedSystemFlags()
    return option.unwrapOrElse(()=>{
      logger.error("SystemCommandReadMethods - Something happened to either the code or the database")
      throw new Error("Internal error")
    })
  }
}