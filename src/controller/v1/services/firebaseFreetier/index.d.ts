import FirebaseService from "./firebaseService";

export as namespace database;

export const enum FirebaseServiceType {
  STORAGE = 1 << 0,
  REALTIME = 1 << 1,
  FIRESTORE = 1 << 2,
  AUTH = 1 << 3,
  ALL = ~(1 << 31)
}
