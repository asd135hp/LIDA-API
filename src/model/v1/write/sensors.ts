export interface Sensor {
  name: string;
	type: string;
	isRunning?: boolean;
}

export interface UpdatingSensor {
	name: string;
	type?: string;
	isRunning?: boolean;
}

export interface SensorData {
	value: number;
	timeStamp: number;
}

export interface DatabaseSensorData {
	sensorName: string;
	value: number;
	timeStamp: number;
}