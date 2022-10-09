import { Request, Response, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { logger } from "./constants";
import DatabaseErrorEvent from "./model/v1/events/databaseErrorEvent";

function validationError(err: ValidateError, req: Request){
  logger.error(`
    Caught Validation Error for ${req.path}: ${JSON.stringify(err.fields)}.
    Message named ${err.name}: ${err.message}.
    Stack trace: ${err.stack}.`
  );

  return new DatabaseErrorEvent(JSON.stringify({
    message: "Validation Failed: ",
    details: err?.fields,
  }), 500)
}

function genericError(err: Error, req: Request){
  logger.error(`
    Caught Error for ${req.path}: ${err.message}.
    Stack trace: ${err.stack}.
  `)
  if(err.message === "Unsupported state or unable to authenticate data")
    return new DatabaseErrorEvent("Wrong credentials. Unable to authenticate data", 500)

  return new DatabaseErrorEvent("Internal Server Error", 500)
}

function typeError(err: TypeError, req: Request){
  logger.error(`
    Caught TypeError for ${req.path}: ${err.message}.
    Stack trace: ${err.stack}.`
  )
  return new DatabaseErrorEvent("Internal Server Error", 500)
}

export default function serverErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof ValidateError) return res.status(422).json(validationError(err, req));
  if (err instanceof TypeError) return res.status(500).json(typeError(err, req))
  if (err instanceof Error) return res.status(500).json(genericError(err, req))
  if (typeof(err) == 'object') {
    const newErr = err as { type: string, [name: string]: any }
    if(!newErr) return res.status(500).json({ message: "Unknown error" })
    return res.status(newErr.type == "Security" ? 403 : 500).json(err)
  }
  next();
}