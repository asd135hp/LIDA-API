import { DataSnapshot, ThenableReference, Reference } from "firebase-admin/database"
import { IterableJson } from "../../../../model/json"

export type QueryFunction = (reference: Reference)=>Promise<DataSnapshot|void>
export type ErrorHandler = (error: Error)=>any
export type TransactionCallback = (json: IterableJson)=>any
export type TransactionResult = { committed: boolean, snapshot: DataSnapshot }

export default interface FirebaseRealtimeFacade {
  /**
   * Apply new root reference to the current service object
   * @param basePath New root path for application
   */
  changeRootReference(basePath: string): FirebaseRealtimeFacade;
  
  /**
   * Get content from provided path
   * @param path Optional, path must be relative to root path. If not specified, root path will be used instead
   * @param queryCallback A query callback that returns a DataSnapshot object. If the query is involved
   * with reordering data then it is recommended to return void and handling data right inside
   * this callback
   */
  getContent(path?: string, queryCallback?: QueryFunction): Promise<DataSnapshot>;

  /**
   * Push content to the provided path, new key will be auto-generated by Firebase
   * @param content 
   * @param path Optional, path must be relative to root path. If not specified, root path will be used instead
   * @param onComplete 
   */
  pushContent(content: any, path?: string, onComplete?: ErrorHandler): ThenableReference;

  /**
   * Replace original content in the provided path with a new one
   * @param content 
   * @param path Optional, path must be relative to root path. If not specified, root path will be used instead
   * @param onComplete 
   */
  setContent(content: any, path?: string, onComplete?: ErrorHandler): Promise<TransactionResult>;

  /**
   * Update content in the provided path (this is different from replacing data)
   * @param content 
   * @param path Optional, path must be relative to root path. If not specified, root path will be used instead
   * @param onComplete 
   */
  updateContent(content: any, path?: string, onComplete?: ErrorHandler): Promise<TransactionResult>;
 
  /**
   * Delete content from provided path
   * @param path A path must be specified here to prevent wiping the whole database
   * @param onComplete 
   */
  deleteContent(path: string, onComplete?: ErrorHandler): Promise<TransactionResult>;

  /**
   * Run a custom transaction block for firebase database server
   * @param transaction 
   * @param path Optional, path must be relative to root path. If not specified, root path will be used instead
   * @param onComplete 
   * @param applyLocally 
   */
  runTransaction(
    transaction: TransactionCallback,
    path?: string,
    onComplete?: ErrorHandler,
    applyLocally?: boolean
  ): Promise<TransactionResult>
}