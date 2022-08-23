export interface SnapshotDownloadResponse {
  newFileName: string
  downloadUrl: string
  startDate: number
  endDate: number
  decompressionByteLength: number,
  note: string
}