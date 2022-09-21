import { Server } from "http";
import { logger } from "./constants";
import CommandBus from "./controller/v1/model/bus/commandBus";
import WriteModel from "./controller/v1/model/writeModel";
import CommandFacade from "./controller/commandFacade";
import EventBus from "./controller/v1/model/bus/eventBus";
import EventProcessor from "./controller/v1/model/eventProcessor";
import DataSavingModel from "./controller/v1/model/dataSavingModel";
import { NextFunction } from "express-serve-static-core";
// one time setup script

let start = new CommandFacade();
let commandBus = new CommandBus(start);
let writeModel = new WriteModel(commandBus);
let dataSavingModel = new DataSavingModel(commandBus);
let eventBus = new EventBus(writeModel);
let processEvent = new EventProcessor(eventBus);

// a little bit bad since these are global variables but it is what it is.
// what's matter is that it works perfectly fine on production server
export function apiSetupMiddleware(req: Express.Request, res: Express.Response, next: NextFunction) {
  start ||= new CommandFacade();
  commandBus ||= new CommandBus(start);
  writeModel ||= new WriteModel(commandBus);
  dataSavingModel ||= new DataSavingModel(commandBus);
  eventBus ||= new EventBus(writeModel);
  processEvent ||= new EventProcessor(eventBus);
  next()
}

export function closeApiSetup(){
  start.end();
  commandBus.end();
  writeModel.end();
  dataSavingModel.end();
  eventBus.end();
  processEvent.onFinished();
}

export function onTermination(terminationCall: (...args: any[])=>void){
  process.on("SIGINT", terminationCall)
  process.on("SIGTERM", terminationCall)
}

// routing subscribers and publishers
export default function apiSetup(server?: Server){
  // publishers - subscribers (in the diagram for backend)
  const start = new CommandFacade();
  const commandBus = new CommandBus(start);
  const writeModel = new WriteModel(commandBus);
  const dataSavingModel = new DataSavingModel(commandBus);
  const eventBus = new EventBus(writeModel);
  const processEvent = new EventProcessor(eventBus);

  // termination of 
  const closePubSub = ()=>{
    start.end();
    commandBus.end();
    writeModel.end();
    dataSavingModel.end();
    eventBus.end();
    processEvent.onFinished();
  }

  const terminationFcn = ()=>{
    logger.info("The process ended with either a SIGINT or SIGTERM")
    closePubSub()
    server?.close();
    process.exit(0);    
  }

  onTermination(terminationFcn)

  return closePubSub
}