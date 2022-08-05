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
export interface ActuatorCommand {
	timeStamp: number;
  toggleCommand?: ToggleCommand;
  motorCommand?: MotorCommand[];
  timesPerDay: number
}

/**
 * Command representation for toggle-based actuator (air pump)
 */
export interface ToggleCommand {
  state: boolean
}

/**
 * Command representation for motor action, requested by Alex
 */
export interface MotorCommand {
  duration: number;
  isClockwise: boolean;
}