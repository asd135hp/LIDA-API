import winston from "winston";
import config from "./constants.config.json"
import { existsSync } from "fs";

// describe a table for creating a new one
export interface TableProps {
  schema: string;
  name: string;
  props: {
    [columns: string]: string;
  }
}

// set up
(()=>{
  let count = 0
  while(!existsSync(`${__dirname}/${Array(count).fill("../").join("")}.env`)){
    count++
  }
  require('dotenv').config({ path: `${__dirname}/${Array(count).fill("../").join("")}.env`})
})()

// database connection
// add an .env file with following content: DATABASE_URL=[url here]\r\nSSL=false
// \r\n means pressing enter
export const dbConnection = (()=>{
  return {
    databaseUrl: process.env.DATABASE_URL,
    ssl: process.env.SSL_PARAM == undefined ? { rejectUnauthorized: false } : !!+process.env.SSL_PARAM
  }
})()

export const logger = winston.createLogger({
  level: config.logger.level,
  levels: config.logger.levels,
  format: winston.format.json(),
  defaultMeta: config.logger.defaultMeta,
  transports: (()=>{
    return [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.prettyPrint({ colorize: true }),
          winston.format.simple()
        ),
      })
    ]
  })(),
})

export const firebasePathConfig = (()=>{
  if(process.env.NODE_ENV === 'test') return config.firebase.storage.test
  if(process.env.NODE_ENV === 'production') return config.firebase.storage.production
  if(process.env.NODE_ENV === 'development') return config.firebase.storage.development
  return config.firebase.storage.test
})();

export const schemaName = config.schemaName

// Australia/Melbourne here if the server is designated in this zone
// but this is "utc", based on constants.config.json file
export const DATABASE_TIMEZONE = config.timezone || "Australia/Melbourne"

export const LOG_LINES = config.limit.logLines

export const SENSOR_LIMIT = config.limit.sensor

export const ACTUATOR_LIMIT = config.limit.actuator

export const PROMISE_CATCH_METHOD = (reason: any) => {
  logger.error(reason); 
  // don't break the code when in production
  if(process.env.NODE_ENV !== 'production' ) return reason
}

export const COMPRESSION_SETTINGS = config.compression

export const TEST_SETUP_THROWS_ERROR = config.test.setupThrowsError

export const TEST_ACCOUNT = config.test.account

export const COMPONENTS_PATH = config.componentPath

/// extract from process.env

export const COOKIE_SECRET = process.env.SECRET_COOKIESECRET

export const SESSION_SECRET = process.env.SECRET_SESSIONSECRET

export const RAW_CIPHER_KEY = Buffer.from(process.env.SECRET_CIPHERKEY, "base64")

export const RAW_CIPHER_IV = Buffer.from(process.env.SECRET_CIPHERIV, "base64")

export const CIPHER_ALGORITHM = process.env.SECRET_CIPHERALGORITHM

export const FIREBASE_CONFIG = {
  apiKey: process.env.SECRET_FIREBASECONFIG_APIKEY,
  authDomain: process.env.SECRET_FIREBASECONFIG_AUTHDOMAIN,
  databaseURL: process.env.SECRET_FIREBASECONFIG_DATABASEURL,
  projectId: process.env.SECRET_FIREBASECONFIG_PROJECTID,
  storageBucket: process.env.SECRET_FIREBASECONFIG_STORAGEBUCKET,
  messagingSenderId: process.env.SECRET_FIREBASECONFIG_MESSAGINGSENDERID,
  appId: process.env.SECRET_FIREBASECONFIG_APPID
}

export const SERVICE_ACCOUNT_CREDENTIALS: { [key: string]: string } = {
  type: process.env.SERVICEACCOUNTKEY_TYPE,
  project_id: process.env.SERVICEACCOUNTKEY_PROJECT_ID,
  private_key_id: process.env.SERVICEACCOUNTKEY_PRIVATE_KEY_ID,
  private_key: JSON.parse(process.env.SERVICEACCOUNTKEY_PRIVATE_KEY) as string,
  client_email: process.env.SERVICEACCOUNTKEY_CLIENT_EMAIL,
  client_id: process.env.SERVICEACCOUNTKEY_CLIENT_ID,
  auth_uri: process.env.SERVICEACCOUNTKEY_AUTH_URI,
  token_uri: process.env.SERVICEACCOUNTKEY_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SERVICEACCOUNTKEY_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.SERVICEACCOUNTKEY_CLIENT_X509_CERT_URL
}