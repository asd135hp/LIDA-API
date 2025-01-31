import express, { NextFunction } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import compression from "compression"
import expressSession from "express-session"

import { RegisterRoutes } from "./build/routes"
import index from "./src/view";
import { COOKIE_SECRET, logger, SESSION_SECRET } from "./src/constants";
import apiSetup, { apiSetupMiddleware, closeApiSetup, onTermination } from "./src/apiSetup";
import serverErrorHandler from "./src/serverErrorHandler"
import serveStatic from "serve-static"

const app = express();

(()=>{
  const port = process.env.PORT || 5000;

  app.use(express.json());
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(cors());
  app.use(compression());       // can opt-out this option if the server is resource-limited

  app.use(serveStatic('public'))
  app.use(expressSession({ secret: SESSION_SECRET, resave: true, saveUninitialized: true}))
  app.use(cookieParser(COOKIE_SECRET));

  // routes registering
  app.use('/', index)     // web page - login + data saving
  RegisterRoutes(app)     // api routes
  app.use(serverErrorHandler);
  app.use(apiSetupMiddleware);

  onTermination(closeApiSetup);

  const server = app.listen(port, ()=>{
    logger.info("Start setting up API")
    // for PostgreSQL only
    // if(process.env.NODE_ENV === 'production') {
    //   dropAllTables().then(()=>setupPostgreSQL())
    //   logger.info("Finished setting up fresh version of API database")
    // }
    
    //apiSetup(server)
    logger.info("Finished setting up API")
    logger.info(`Express: Listening on port ${port}`)
  })

  server.on("connect", ()=>{
    logger.info("A user logged in")
  })

  server.on("close", ()=>{
    logger.info("Closing server...")
  })

})()

module.exports = app