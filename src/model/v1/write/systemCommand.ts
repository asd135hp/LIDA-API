// initial commands for initiating the system
export interface SystemCommand {
  start: boolean,
  pause: boolean,
  stop: boolean,
  restart: boolean,
  [flagName: string]: boolean
}