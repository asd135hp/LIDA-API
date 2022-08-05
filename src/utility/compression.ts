import { strToU8, zlibSync, strFromU8, decompressSync } from "fflate"
import { COMPRESSION_SETTINGS, logger } from "../constants"
import { FirebaseDateRange } from "../model/dateRange"
import { IterableJson } from "../model/json"
import { Option, Some, None } from "../model/patterns/option"

interface CompressionResult {
  fileName: string;
  compressedData: Uint8Array
}

/**
 * Private utility function for compressing data
 * @param json 
 * @param dateRange 
 */
export function compressJsonDataSync(
  json: IterableJson,
  dateRange: FirebaseDateRange
): Option<CompressionResult> {
  try {
    let name = `${dateRange.startDate};${dateRange.endDate}`
    const byteArr = strToU8(JSON.stringify(json))
    const compressedData = zlibSync(byteArr, { level: 9 })

    name += `;${byteArr.byteLength}`
    const fileName = `${Buffer.from(name, "ascii").toString("base64")}.${COMPRESSION_SETTINGS.fileExtension}`
    return Some({ fileName, compressedData })
  } catch(err) {
    logger.error("CompressJsonDataSync - Data compression failed with the following error: " + err)
    return None
  }
}

/**
 * Private utility function for decompressing data
 * @param compressedData 
 * @returns 
 */
export function decompressData(compressedData: Uint8Array, outLength?: number): Option<IterableJson> {
  try {
    const rawDecompressed = decompressSync(compressedData, outLength ? new Uint8Array(outLength) : null)
    const jsonStr = strFromU8(rawDecompressed)
    return Some(JSON.parse(jsonStr))
  } catch(err){
    logger.error("DecompressData - Data decompression failed with following error: " + err)
    return None
  }
}