import { Request, Response, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { logger } from "./constants";

function validationError(err: ValidateError, req: Request){
  logger.error(`Caught Validation Error for ${req.path}: ${JSON.stringify(err.fields)}\nMessage named ${err.name}: ${err.message}`);
  return {
    message: "Validation Failed",
    details: err?.fields,
  }
}

function genericError(err: Error, req: Request){
  logger.error(`Caught Error for ${req.path}: ${err.message}`)
  return {
    message: "Internal Server Error"
  }
}

function typeError(err: TypeError, req: Request){
  logger.error(`Caught TypeError for ${req.path}: ${err.message}`)
  return {
    message: "Internal Server Error"
  }
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
  next();
}