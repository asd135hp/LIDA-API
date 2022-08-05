/**
 * From string to byte array
 * @param str 
 * @returns 
 */
export function stringToByteArray(str: String): Uint8Array{
  const byteArray = new Array<number>()
  for(let i = 0; i < str.length; i++) byteArray.push(str.charCodeAt(i))
  return new Uint8Array(byteArray)
}

/**
 * From byte array to string
 * @param byteArray 
 * @param encoding 
 * @returns 
 */
export function byteArrayToString(byteArray: Uint8Array | Uint16Array | Uint32Array, encoding?: BufferEncoding): string {
  return Buffer.from(byteArray).toString(encoding || "utf-8")
}