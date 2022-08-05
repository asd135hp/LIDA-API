import { Route, SuccessResponse, Response, Controller, Post, BodyProp } from "tsoa";
import User from "../../../model/v1/auth/user";
import { persistentFirebaseConnection } from "../../v1/services/firebaseFreetier/firebaseService";

// entry point for the security of this application
const auth = persistentFirebaseConnection.authService

@Route(`api/v1`)
@SuccessResponse(200, "Ok")
@Response(403, "Forbidden")
@Response(404, "Not Found")
@Response(408, "Request Timeout")
export class SecurityMethods extends Controller {
  @Post("register")
  async register(
    @BodyProp() email: string,
    @BodyProp() password: string
  ): Promise<void> {
    return await auth.registerWithEmail(email, password)
  }

  @Post("login")
  async login(
    @BodyProp() email: string,
    @BodyProp() password: string
  ): Promise<User> {
    return await auth.loginWithEmail(email, password)
  }

  // not a good path name tbh
  @Post("login/refresh")
  async refreshLoginCredentials(
    @BodyProp() email: string,
    @BodyProp() password: string
  ): Promise<User> {
    return await auth.reauthenticationWithEmail(email, password)
  }
}