import DatabaseEvent from "./events/databaseEvent"

export type CQRSError = {
  message: string,
  statusCode: number,
  ignore?: boolean,
  eventWhenIgnored?: DatabaseEvent 
}