export interface SnapshotDownloadResponse {
  newFileName: string
  bucketLink: string
  fileName: string
  startDate: number
  endDate: number
  decompressionByteLength: number
}