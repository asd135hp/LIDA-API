import {
  CollectionReference, DocumentSnapshot, DocumentData, QuerySnapshot,
  Precondition, DocumentReference, UpdateData, Transaction
} from "firebase-admin/firestore";

type QueryResult = QuerySnapshot<DocumentData>
type DocumentResult = DocumentSnapshot<DocumentData>
export type TransactionCallback = (snapshot: DocumentSnapshot, transaction: Transaction) => Promise<void>

export default interface FirebaseFirestoreFacade {
  /**
   * Create new collection and add the provided content to that collection on Firestore.
   * The content will reside inside an automatically generated document with random name on server side
   * @param collectionPath Relative path from root to the Firestore collection
   * @param content Content to be pushed, generally a JSON
   * @param parentDocument Optional. If intending-to-create collection has its parent document reference known,
   * this parameter can be provided to reduce the need of writing a relative path for collectionPath variable
   */
  addContentToCollection(
    collectionPath: string,
    content: DocumentData,
    parentDocument?: DocumentReference
  ): Promise<DocumentReference<DocumentData>>;

  /**
   * A more customisable getCollection method.
   * It allows content to be filtered when querying a collection with Firestore SDK methods
   * @param collectionPath Relative path from root to the Firestore collection
   * @param callback Query callback function that returns a QueryResult
   * @returns Result of the query
   */
  queryCollection(
    collectionPath: string,
    callback: (collection: CollectionReference)=>Promise<QueryResult>
  ): Promise<QueryResult>;

  /**
   * Gets/Dumps all content of a collection
   * @param collectionPath Relative path from root to the Firestore collection
   */
  getCollection(collectionPath: string): Promise<QueryResult>;

  /**
   * Create new document with new content
   * @param documentPath Relative path from root to the Firestore document
   * @param content Typically a JSON
   */
  createDocument(documentPath: string, content: DocumentData): Promise<void>;

  /**
   * Set a document with new content
   * @param documentPath Relative path from root to the Firestore document
   * @param content Typically a JSON
   */
  setDocument(documentPath: string, content: DocumentData): Promise<void>;

  /**
   * Update a document with new content
   * @param documentPath Relative path from root to the Firestore document
   * @param content Typically a JSON
   * @param precondition 
   */
  updateDocument(documentPath: string, content: UpdateData, precondition?: Precondition): Promise<void>;
  
  /**
   * Gets/Dumps all content of a document
   * @param documentPath Relative path from root to the Firestore document
   */
  getDocument(documentPath: string): Promise<DocumentResult>;

  /**
   * Delete all content related to a documennt
   * @param documentPath Relative path from root to the Firestore document
   * @param precondition 
   */
  deleteDocument(documentPath: string, precondition?: Precondition): Promise<void>;

  /**
   * Customised transaction block if default methods are not enough
   * @param documentPath Relative path from root to the Firestore document
   * @param transaction Custom transaction code
   */
  runTransaction(documentPath: string, transaction: TransactionCallback): Promise<void>;
}