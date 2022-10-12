import { Route, SuccessResponse, Response, Controller, Post, BodyProp } from "tsoa";
import User from "../../../model/v1/auth/user";
import { persistentAuthService } from "../../v1/services/serviceEntries";

@Route(`api/v1`)
@SuccessResponse(200, "Ok")
@Response(403, "Forbidden")
@Response(404, "Not Found")
@Response(408, "Request Timeout")
export class SecurityMethods extends Controller {
  @Post("login")
  async login(
    @BodyProp() email: string,
    @BodyProp() password: string
  ): Promise<User> {
    // https://stackoverflow.com/questions/13895679/how-do-i-secure-rest-api-calls
    // should refresh key when trying to login
    await persistentAuthService.reauthenticationWithEmail(email, password)
    return await persistentAuthService.loginWithEmail(email, password)
  }
}