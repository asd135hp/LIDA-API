import { strToU8, zlibSync, strFromU8, decompressSync } from "fflate"
import { Firestore } from "@google-cloud/firestore"
import { CloudEventFunction } from "@google-cloud/functions-framework"
import { Storage } from "@google-cloud/storage"

const firestore = new Firestore({ projectId: process.env.GOOGLE_CLOUD_PROJECT })
const storage = new Storage({ projectId: process.env.GOOGLE_CLOUD_PROJECT })

type IterableJson = { [key: string]: any }
type FirebaseDateRange = { startDate: number, endDate: number }
type CompressionResult = {
  fileName: string;
  compressedData: Uint8Array
}

const fileExtension = ".zip"

/**
 * Private utility function for compressing data
 * @param json 
 * @param dateRange 
 */
function compressJsonDataSync(
  json: IterableJson,
  dateRange: FirebaseDateRange
): CompressionResult {
  try {
    let name = `${dateRange.startDate};${dateRange.endDate}`
    const byteArr = strToU8(JSON.stringify(json))
    const compressedData = zlibSync(byteArr, { level: 9 })

    name += `;${byteArr.byteLength}`
    const fileName = `${Buffer.from(name, "ascii").toString("base64")}.${fileExtension}`
    return { fileName, compressedData }
  } catch(err) {
    return null
  }
}

/**
 * Private utility function for decompressing data
 * @param compressedData 
 * @returns 
 */
function decompressData(compressedData: Uint8Array, outLength?: number): IterableJson {
  try {
    const rawDecompressed = decompressSync(compressedData, outLength ? new Uint8Array(outLength) : null)
    const jsonStr = strFromU8(rawDecompressed)
    return JSON.parse(jsonStr)
  } catch(err){
    return null
  }
}

export const saveSensorSnapshot: CloudEventFunction = event => {
  return event;
}

export const getSensorSnapshot: CloudEventFunction = event => {
  return event;
  // const folderPath = `sensors/run${runNumber}`
  // const [files] = await storage.readFolderFromStorage(folderPath)
  // if(!files || !files.length) return None
  
  // logger.debug(`There are ${files.length} in ${folderPath}`)
  // // only one file per run folder
  // const [file] = files
  // const [startDate, endDate, byteLength, metadata] = parseStorageFileMetaData(await file.getMetadata())

  // return Some({
  //   newFileName: `${startDate}_${endDate}_run${runNumber}.zip`,
  //   bucketLink: metadata.bucket,
  //   fileName: metadata.name,
  //   startDate, endDate,
  //   decompressionByteLength: byteLength,
  //   databaseType: "firebase"
  // })
}