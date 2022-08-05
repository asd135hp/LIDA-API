import { Pool, PoolClient } from "pg";
import { dbConnection as conn, logger } from "../../constants";

/**
 * Transaction layer wrapper method for modifying data (INSERT, UPDATE and DELETE)
 * @param callback For executing related queries
 * @param params Additional parameters for callback function
 * @returns A promise returned by the callback function
 */
export async function transactionWrapper<T>(
  callback: (pool: PoolClient, ...params: any[]) => Promise<T>,
  ...params: any[]
): Promise<T> {
  logger.info("Created a PostgreSQL transaction wrapper")
  return clientWrapper<T>(async pool => {
    try {
      await pool.query("BEGIN")
      const result = await callback(pool, ...params)
      await pool.query("COMMIT")
      return result
    } catch(e){
      await pool.query("ROLLBACK")
      logger.error(`An error occurred when making a data transaction: ${e.message}.\nStack trace: ${e.trace}`)
      return null
    } finally {
      logger.info("Finished PostgreSQL transaction wrapper")
    }
  }, ...params)
}

/**
 * Client layer wrapper that is perfect for reading data from the database (SELECT).
 * 
 * WARNING: Do not use this method for data transaction. Use transactionWrapper method instead
 * if modifying data is intended
 * @param callback For executing related queries
 * @param params Additional parameters for callback function
 * @returns A promise returned by the callback function
 */
export async function clientWrapper<T>(
  callback: (pool: PoolClient, ...params: any[])=>Promise<T>,
  ...params: any[]
): Promise<T>{
  logger.info("Created a PostgreSQL client wrapper")
  let pool: PoolClient;
  try {
    pool = await new Pool({
      connectionString: conn.databaseUrl,
      ssl: conn.ssl
    }).connect()
    let result = await callback(pool, ...params)
    return result
  } catch (e) {
    logger.error(`An error occurred when making a data request: ${e.message}. Stack trace: ${e.trace}`)
  } finally {
    pool?.release()
    logger.info("Finished PostgreSQL client wrapper")
  }
}