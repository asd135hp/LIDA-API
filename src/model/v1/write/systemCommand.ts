// initial commands for initiating the system
export interface SystemCommand {
  start: boolean,
  pause: boolean,
  stop: boolean,
  restart: boolean
}

export interface SystemCommandIterable extends SystemCommand {
  [flagName: string]: boolean
}