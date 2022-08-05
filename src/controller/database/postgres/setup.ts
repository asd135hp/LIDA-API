import { readFile } from "fs/promises";
import path from "path";
import { logger, schemaName } from "../../../constants";
import  { clientWrapper, transactionWrapper } from "./client";

// drop all possible tables defined in dropTables.sql
export async function dropAllTables(isTest = false){
  await transactionWrapper(async pool => {
    await pool.query(
      await readFile(
        path.join(__dirname, isTest ? "/sql/dropTestTables.sql" : "/sql/dropTables.sql"),
        { encoding: "utf8" }
      )
    )
  })
}

// drops the only schema we have. might add more in the future
export async function dropSchema(){
  await transactionWrapper(async pool => {
    await pool.query(`DROP SCHEMA ${schemaName} CASCADE;`)
  })
}

// this function somehow does not accept arguments...
export async function setupPostgreSQL(isTest = false){
  await clientWrapper(async pool => {
    const tableCreationQuery = await readFile(
      path.join(__dirname, isTest ? "/sql/createTestTables.sql" : "/sql/createTables.sql"),
      { encoding: "utf8" }
    )
    
    for(const creationQuery of tableCreationQuery.split("\r\n\r\n")){
      try{
        logger.info(creationQuery)
        await pool.query(creationQuery)
          .then(val => logger.info(val), err => logger.error(err))
      } catch(e) { logger.error(e) }
    }
  })
}