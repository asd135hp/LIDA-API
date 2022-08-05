import { Server } from "http";
import winston from "winston"
import { logger } from "./constants";
import CommandBus from "./controller/v1/model/bus/commandBus";
import WriteModel from "./controller/v1/model/writeModel";
import CommandFacade from "./controller/commandFacade";
import EventBus from "./controller/v1/model/bus/eventBus";
import EventProcessor from "./controller/v1/model/eventProcessor";
import DataSavingModel from "./controller/v1/model/dataSavingModel";
// one time setup script

// routing subscribers and publishers
export default function apiSetup(server?: Server){
  if(process.env.NODE_ENV == 'development') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

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

  const termination = ()=>{
    logger.info("The process ended with either a SIGINT or SIGTERM")
    closePubSub()
    server?.close();
    process.exit(0);    
  }

  process.on("SIGINT", termination)
  process.on("SIGTERM", termination)

  return closePubSub
}