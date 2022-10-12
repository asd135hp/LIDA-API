import AS from "./firebaseFreetier/actuatorService";
import CS from "./firebaseFreetier/counterService";
import DSS from "./firebaseFreetier/dataSavingService";
import { persistentFirebaseConnection } from "./firebaseFreetier/firebaseService";
import SS from "./firebaseFreetier/sensorService";
import SCS from "./firebaseFreetier/systemCommandService";
import SLS from "./firebaseFreetier/systemLogsService";

// explicitly defines service entries since they are not tightly coupled
// so any well formated service class can be plugged in
// NOTE: Can use factory pattern here, though I'm not sure about Typescript typing
export class ActuatorService extends AS {}
export class SensorService extends SS {}
export class CounterService extends CS {}
export class DataSavingService extends DSS {}
export class SystemCommandService extends SCS {}
export class SystemLogsService extends SLS {}
export const persistentAuthService = persistentFirebaseConnection.authService