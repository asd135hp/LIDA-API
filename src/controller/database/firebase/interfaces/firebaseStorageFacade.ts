import {
  UploadResponse, DeleteFileResponse, SaveOptions, GetFileOptions, GetFilesResponse
} from "@google-cloud/storage";

export default interface FirebaseStorageFacade {
  /**
   * Change the encoding that will be applied to all methods of the current object
   * that depends on such encoding value (namely uploadBytes and appendBytes)
   * @param encoding Default to utf-8
   */
  changeEncoding(encoding: BufferEncoding): FirebaseStorageFacade;

  /**
   * Check whether the file exists in the database
   * @param name Name of the file. General formula: Relative path (no initial slash) + name + fileExtension
   */
  isFileExists(name: string): Promise<boolean>;

  /**
   * Read a single file from storage
   * @param name Name of the file. General formula: Relative path (no initial slash) + name + fileExtension
   */
  readFileFromStorage(name: string): Promise<Buffer>;

  /**
   * Read files from a folder in the storage
   * @param folderName Folder name in the storage. This should be a relative path with no ending slashes
   * @param options Futher options for reading files from storage
   * @returns A get file response that has a list of files, the next query and api response as variables
   * in the array
   */
  readFolderFromStorage(folderName: string, options?: GetFileOptions): Promise<GetFilesResponse>;

  /**
   * Upload bytes to the storage
   * @param name Name of the file. General formula: Relative path (no initial slash) + name + fileExtension
   * @param content 
   * @param options Upload options for Google Cloud Storage
   */
  uploadBytesToStorage(
    name: string,
    content: string | Buffer,
    options?: SaveOptions
  ): Promise<void>;

  /**
   * WARNING: USE THIS METHOD AT YOUR OWN RISK SINCE APPENDING DATA MIGHT MAKE THE FILE UNREADABLE
   * 
   * Appends bytes to the already existing file in the Firebase Storage. It should work for normal text file
   * types like .txt but won't for other types that is external program dependent (.zip, .7z or .exe)
   * @param content 
   * @param name Relative path to the root, including file extensions but excluding anything similar to ../
   */
  appendBytesToFile(
    name: string,
    content: string | Buffer,
    options?: SaveOptions
  ): Promise<void>;

  /**
   * Delete a single file from storage
   * @param name Name of the file. General formula: Relative path (no initial slash) + name + fileExtension
   */
  deleteFileFromStorage(name: string): Promise<DeleteFileResponse>;

  /**
   * Delete all files in a single folder from storage
   * @param folderName Folder name in the storage. This should be a relative path with no ending slashes
   */
  deleteFolderFromStorage(folderName: string): Promise<void>;
}