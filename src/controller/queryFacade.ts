import { ActuatorReadMethods } from "./v1/methods/read/actuatorReadMethods";
import { SystemLogsReadMethods } from "./v1/methods/read/systemLogsReadMethods";
import { SensorReadMethods } from "./v1/methods/read/sensorReadMethods";
import { DataSavingReadMethods } from "./v1/methods/read/dataSavingReadMethods";
import { SecurityMethods } from "./security/methods/securityMethods";
import { SystemCommandReadMethods } from "./v1/methods/read/systemCommandReadMethods";

// a facade class that points to all possible reading methods
export default class QueryFacade {
  static sensor = new SensorReadMethods();
  static actuator = new ActuatorReadMethods();
  static logs = new SystemLogsReadMethods();
  static dataSaving = new DataSavingReadMethods();
  static systemCommand = new SystemCommandReadMethods();
  static security = new SecurityMethods();
}