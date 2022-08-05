import { App } from "firebase-admin/app"
import firebaseAdmin from "firebase-admin"
import { DataSnapshot, ThenableReference, Reference, Database, Query } from "firebase-admin/database"
import { logger, PROMISE_CATCH_METHOD } from "../../../../constants";
import FirebaseRealtimeFacade, { ErrorHandler, QueryFunction, TransactionCallback, TransactionResult } from "../../firebase/interfaces/firebaseRealtimeFacade";
import { IterableJson } from "../../../../model/json";
import updateObject from "../../../../utility/updateObject";
import { Option, Some, None } from "../../../../model/patterns/option"

type ResultFilter = (json: IterableJson)=>boolean

/**
 * Best way to get data from a query object statement
 * 
 * It utilises Query.once method and the event type is value
 * @param query The final query to get result from
 * @param filter Optional filter function to filter additional fields from children nodes
 * @returns An iterable json object instead of a normal object or any type
 */
export async function getQueryResult(query: Query, filter?: ResultFilter): Promise<IterableJson>{
  const result: IterableJson = {}
  await query.once('child_added', child => {
    const data = child.val()
    if(!filter || filter(data)) result[child.key] = data;
  })

  logger.info(`Result of query that is sorted by child at ${query.ref.key}: ${result}`)
  return result
}

/**
 * Best way to get data from a query object statement
 * 
 * It utilises Query.once method and the event type is value
 * @param query The final query to get result from
 * @param filter Optional filter function to filter additional fields from children nodes
 * @returns An iterable json object instead of a normal object or any type
 */
export async function getQueryResultAsArray(query: Query, filter?: ResultFilter): Promise<Option<any[]>>{
  const resultArr: any[] = []
  
  // child_added produces a weird bug whenever the query does not produce any results
  // e.g: value is non-existent for the provided field key
  await query.once('value', snapshot => {
    if(!snapshot.exists()) {
      logger.warn("Snapshot does not exist with a value of " + snapshot.val())
      return
    }
    
    snapshot.forEach(child => {
      const data = child.val()
      if(!filter || filter(data)) resultArr.push(data)
    })
  })

  logger.info(`Result of query that is sorted by child at ${query.ref.key}: ${resultArr}`)
  return resultArr.length == 0 ? None : Some(resultArr)
}

// quick method for logging error
const logError = (err: Error, onComplete: ErrorHandler) => (err && logger.error(err), onComplete)

export default class FirebaseRealtimeService implements FirebaseRealtimeFacade {
  private database: Database
  private rootRef: Reference;

  constructor(firebaseApp: App, basePath?: string){
    this.database = firebaseAdmin.database(firebaseApp)
    this.rootRef = this.database.ref(basePath);
  }

  changeRootReference(basePath: string): FirebaseRealtimeFacade {
    this.rootRef = this.database.ref(basePath);
    return this
  }

  async getContent(path?: string, queryCallback?: QueryFunction): Promise<DataSnapshot> {
    const ref = path ? this.rootRef.child(path) : this.rootRef
    return (queryCallback ? queryCallback(ref) : ref.get())
      .then(snapshot => (logger.info(`Realtime database service: Got realtime data from ${path}`), snapshot))
      .catch(PROMISE_CATCH_METHOD)
  }

  pushContent(content: any, path?: string, onComplete?: ErrorHandler): ThenableReference {
    return (path ? this.rootRef.child(path) : this.rootRef)
      .push(content, err => {
        if(!err) logger.info(`Realtime database service: Pushed content at ${path} for realtime database`)
        logError(err, onComplete)
      })
  }

  async setContent(content: any, path?: string, onComplete?: ErrorHandler): Promise<TransactionResult> {
    return (path ? this.rootRef.child(path) : this.rootRef)
      .transaction(_ => content, err => {
        if(!err) logger.info(`Realtime database service: Set content at ${path} for realtime database`)
        logError(err, onComplete)
      })
  }

  async updateContent(content: any, path?: string, onComplete?: ErrorHandler): Promise<TransactionResult> {
    return (path ? this.rootRef.child(path) : this.rootRef)
      .transaction(oldContent => updateObject(oldContent, content), err => {
        if(!err) logger.info(`Realtime database service: Updated content at ${path} for realtime database`)
        logError(err, onComplete)
      })
  }
  
  async deleteContent(path: string, onComplete?: ErrorHandler): Promise<TransactionResult> {
    return this.rootRef.child(path)
      .transaction(_ => null, err => {
        if(!err) logger.info(`Realtime database service: Deleted content at ${path} for realtime database`)
        logError(err, onComplete)
      })
  }

  async runTransaction(
    transaction: TransactionCallback,
    path?: string,
    onComplete?: (err: Error, commited: boolean, snapshot: DataSnapshot) => void,
    applyLocally?: boolean
  ): Promise<TransactionResult> {
    return (path ? this.rootRef.child(path) : this.rootRef)
      .transaction(
        a => transaction(a),
        (err, b, c) => {
          if(!err) logger.info(`Realtime database service: Ran transaction at ${path} for realtime database`)
          err && logger.error(err);
          onComplete && onComplete(err, b, c)
        },
        applyLocally
      )
  }
}