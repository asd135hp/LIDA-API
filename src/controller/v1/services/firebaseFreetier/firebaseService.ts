import firebaseAdmin from "firebase-admin"
import { App } from "firebase-admin/app";
import FirebaseStorageFacade from "../../../database/firebase/interfaces/firebaseStorageFacade";
import FirebaseStorageService from "../../../database/firebase/services/firebaseStorageService";
import FirebaseRealtimeFacade from "../../../database/firebase/interfaces/firebaseRealtimeFacade";
import FirebaseRealtimeService from "../../../database/firebase/services/firebaseRealtimeService";
import FirebaseFirestoreFacade from "../../../database/firebase/interfaces/firebaseFirestoreFacade";
import FirebaseFirestoreService from "../../../database/firebase/services/firebaseFirestoreService";
import FirebaseAuthFacade from "../../../database/firebase/interfaces/firebaseAuthFacade";
import FirebaseAuthService from "../../../database/firebase/services/firebaseAuthService";
import { FirebaseServiceType } from ".";
import { randomInt } from "crypto";
import { firebasePathConfig, FIREBASE_CONFIG, SERVICE_ACCOUNT_CREDENTIALS } from "../../../../constants";

interface FirebaseRootPath {
  firestoreDocPath?: string;
  storageFolder?: string;
  realtimeUrl?: string;
}

// helper service that connects to firebase, reduces required code in other services
export default class FirebaseService {
  private _storageService: FirebaseStorageFacade;
  private _realtimeService: FirebaseRealtimeFacade;
  private _firestoreService: FirebaseFirestoreFacade;
  private _auth: FirebaseAuthFacade;
  private _app: App;

  constructor(type: FirebaseServiceType, path?: FirebaseRootPath){
    this._app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(SERVICE_ACCOUNT_CREDENTIALS),
      ...FIREBASE_CONFIG
    }, Array(10).fill(0).map(_ => String.fromCharCode(randomInt(65, 90))).join(''))

    if(process.env.NODE_ENV !== 'production') {
      
    }

    if(this.verifyType(type, FirebaseServiceType.STORAGE))
      this._storageService = new FirebaseStorageService(this._app, path?.storageFolder);

    if(this.verifyType(type, FirebaseServiceType.REALTIME))
      this._realtimeService = new FirebaseRealtimeService(this._app, path?.realtimeUrl);

    if(this.verifyType(type, FirebaseServiceType.FIRESTORE))
      this._firestoreService = new FirebaseFirestoreService(this._app, path?.firestoreDocPath);

    if(this.verifyType(type, FirebaseServiceType.AUTH))
      this._auth = new FirebaseAuthService(
        this._app,
        this._storageService || new FirebaseStorageService(this._app)
      )
  }

  get storageService() { return this._storageService }

  get realtimeService() { return this._realtimeService }

  get firestoreService() { return this._firestoreService }

  get authService() { return this._auth }

  /**
   * Bitwise flag - verification of bit presence
   * @param type 
   * @param target 
   * @returns 
   */
  private verifyType(type: FirebaseServiceType, target: FirebaseServiceType){
    return (type & target) == target
  }
}

// seems redundant but actually saves some performance
// this should be the sole service for our system
export const persistentFirebaseConnection = new FirebaseService(FirebaseServiceType.ALL, firebasePathConfig)