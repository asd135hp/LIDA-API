export interface Actuator {
  name: string;
  type: string;
  isRunning?: boolean;
}

export interface UpdatingActuator {
  name: string;
  type?: string;
  isRunning?: boolean;
}

/**
 * 
 */
export interface ActuatorConfig {
	timeStamp: number;
  toggleConfig?: ToggleConfig;
  motorConfig?: MotorConfig[];
  timesPerDay?: number;
}

/**
 * Configuration representation for toggle-based actuator (air pump)
 */
export interface ToggleConfig {
  state: boolean
}

/**
 * Configuration for motor action, requested by Alex
 */
export interface MotorConfig {
  duration: number;
  isClockwise: boolean;
}