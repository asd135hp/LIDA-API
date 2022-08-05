import { App } from "firebase-admin/app";
import firebaseAdmin from "firebase-admin";
import {
  CollectionReference, DocumentSnapshot, DocumentData, WriteResult, DocumentReference,
  QuerySnapshot, Precondition, UpdateData, Firestore
} from "firebase-admin/firestore";
import { logger, PROMISE_CATCH_METHOD } from "../../../../constants";
import FirebaseFirestoreFacade, { TransactionCallback } from "../interfaces/firebaseFirestoreFacade";

type QResult = Promise<QuerySnapshot<DocumentData>>
type DocRef = DocumentReference<DocumentData>

export default class FirebaseFirestoreService implements FirebaseFirestoreFacade {
  private firestore: Firestore
  private rootDoc: DocumentReference
  private currentDocPath: string

  constructor(firebaseApp: App, rootDocPath?: string){
    this.firestore = firebaseAdmin.firestore(firebaseApp)
    this.rootDoc = rootDocPath ? this.firestore.doc(rootDocPath) : null
  }

  private get path(){
    return this.rootDoc && this.currentDocPath ?
      `${this.rootDoc.path}/${this.currentDocPath}` : (this.currentDocPath || this.rootDoc.path)
  }

  async getCollection(collectionPath: string): QResult {
    return (this.rootDoc ?? this.firestore).collection(collectionPath).get()
      .then(snapshot => {
        logger.info(`Firestore service: Got collection at ${snapshot.empty && snapshot.docs[0].ref.parent.path}`)
        return snapshot
      })
      .catch(PROMISE_CATCH_METHOD)
  }

  async queryCollection(collectionPath: string, callback: (collection: CollectionReference)=>QResult): QResult {
    return callback((this.rootDoc ?? this.firestore).collection(collectionPath))
      .then(snapshot => {
        logger.info(`Firestore service: Got collection at ${!snapshot.empty && snapshot.docs[0].ref.parent.path}`)
        return snapshot
      })
      .catch(PROMISE_CATCH_METHOD)
  }

  async addContentToCollection(
    collectionPath: string,
    content: DocumentData,
    parentDocument?: DocRef
  ): Promise<DocRef> {
    return (parentDocument ?? this.rootDoc ?? this.firestore).collection(collectionPath).add(content)
      .then(ref => (logger.info(`Firestore service: Created new document at ${ref.path}`), ref))
      .catch(PROMISE_CATCH_METHOD)
  }

  async getDocument(documentPath: string): Promise<DocumentSnapshot<DocumentData>> {
    this.currentDocPath = documentPath
    return this.firestore.doc(this.path).get()
      .then(snapshot => (logger.info(`Firestore service: Got document at ${this.path}`), snapshot))
      .catch(PROMISE_CATCH_METHOD)
  }

  async createDocument(documentPath: string, content: DocumentData): Promise<void> {
    this.currentDocPath = documentPath
    return this.firestore.runTransaction(async t => {
      const currentDoc = await t.get(this.firestore.doc(this.path))
      t.create(currentDoc.ref, content)
    }).then(res => (logger.info(`Firestore service: Created document at ${this.path}`), res))
      .catch(PROMISE_CATCH_METHOD)
  }

  async setDocument(documentPath: string, content: DocumentData): Promise<void> {
    this.currentDocPath = documentPath
    return this.firestore.runTransaction(async t => {
      const currentDoc = await t.get(this.firestore.doc(this.path))
      t.set(currentDoc.ref, content)
    }).then(res => (logger.info(`Firestore service: Set document at ${this.path}`), res))
      .catch(PROMISE_CATCH_METHOD)
  }

  async updateDocument(documentPath: string, content: UpdateData, precondition?: Precondition): Promise<void> {
    this.currentDocPath = documentPath
    return this.firestore.runTransaction(async t => {
      const currentDoc = await t.get(this.firestore.doc(this.path))
      t.update(currentDoc.ref, content, precondition)
    }).then(res => (logger.info(`Firestore service: Updated document at ${this.path}`), res))
      .catch(PROMISE_CATCH_METHOD)
  }
  
  async deleteDocument(documentPath: string, precondition?: Precondition): Promise<void> {
    this.currentDocPath = documentPath
    return this.firestore.runTransaction(async t => {
      const currentDoc = await t.get(this.firestore.doc(this.path))
      t.delete(currentDoc.ref, precondition)
    }).then(res => (logger.info(`Firestore service: Deleted document at ${this.path}`), res))
      .catch(PROMISE_CATCH_METHOD)
  }

  /**
   * Private method exclusive to this service since it is less recommended to delete a collection than 
   * to delete a document (biased, can be extended to expose this method to its Facade)
   * @param collectionPath Relative path from root to the Firestore collection
   */
  async deleteCollection(collectionPath: string): Promise<void>{
    const path = `${this.rootDoc?.path}/${collectionPath}`
    const collection = await this.firestore.collection(path).get()
    for(const doc of collection.docs)
      await this.firestore.runTransaction(async t => t.delete(doc.ref))
        .catch(reason => reason && logger.error(reason))
  }

  async runTransaction(documentPath: string, transaction: TransactionCallback): Promise<void> {
    this.currentDocPath = documentPath
    return await this.firestore.runTransaction(async t => {
      const currentDoc = await t.get(this.firestore.doc(this.path))
      return await transaction(currentDoc, t)
    }).then(res => (logger.info(`Firestore service: Ran custom transaction at ${this.path}`), res))
      .catch(PROMISE_CATCH_METHOD)
  }
}