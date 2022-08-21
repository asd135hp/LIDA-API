import { App } from "firebase-admin/app";
import firebaseAdmin from "firebase-admin";
import { Bucket } from "firebase-admin/node_modules/@google-cloud/storage"
import { DeleteFileResponse, SaveOptions, GetFileOptions, GetFilesResponse } from "@google-cloud/storage";
import FirebaseStorageFacade from "../../firebase/interfaces/firebaseStorageFacade";
import { logger, PROMISE_CATCH_METHOD } from "../../../../constants";

async function retry<T>(
  callback: ()=>Promise<T>,
  options?: { maxRetries?: number, maxResponseTime?: number }
): Promise<T>{
  options.maxRetries = options?.maxRetries || 10
  options.maxResponseTime = options?.maxResponseTime || 100

  if(options.maxRetries == 0)
    return Promise.reject("Max retries reached while failing to verify source data")

  return callback().catch(() => retry(callback, { maxRetries: options.maxRetries - 1, ...options }))
}

export default class FirebaseStorageService implements FirebaseStorageFacade {
  private bucket: Bucket
  private rootFolder: string
  private currentName: string

  encoding: BufferEncoding

  constructor(firebaseApp: App, rootFolder?: string){
    this.bucket = firebaseAdmin.storage(firebaseApp).bucket()
    this.rootFolder = rootFolder || ""
    this.encoding = "utf-8"
  }

  private get path(){
    return this.rootFolder && this.currentName ?
      `${this.rootFolder}/${this.currentName}` : this.rootFolder || this.currentName
  }

  changeEncoding(encoding: BufferEncoding): FirebaseStorageFacade{
    this.encoding = encoding
    return this
  }

  async isFileExists(name: string): Promise<boolean> {
    this.currentName = name
    return this.bucket.file(this.path).exists()
      .then(res => {
        logger.info(`Storage service: File "${this.path}" ${res[0] ? "exists" : "does not exists"}`)
        return res[0]
      }).catch(PROMISE_CATCH_METHOD)
  }

  async readFileFromStorage(name: string): Promise<Buffer> {
    this.currentName = name
    return this.bucket.file(this.path).download()
      .then(res => (logger.info(`Storage service: Downloaded file: ${this.path}`), res[0]))
      .catch(PROMISE_CATCH_METHOD)
  }

  async readFolderFromStorage(folderName: string, options?: GetFileOptions): Promise<GetFilesResponse> {
    this.currentName = folderName
    return await this.bucket.getFiles({ prefix: this.path, ...options })
      .then(res => (logger.info(`Storage service: Got response from folder in the storage: ${this.path}`), res))
      .catch(PROMISE_CATCH_METHOD)
  }

  async uploadBytesToStorage(
    name: string,
    content: string | Buffer,
    options?: SaveOptions
  ): Promise<void> {
    this.currentName = name
    if(typeof(content) === 'string') content = Buffer.from(content).toString(this.encoding)
    return this.bucket.file(this.path).save(content, options)
      .then(res => {
        logger.info(`Storage service: Uploaded file named ${this.path} to the bucket with response: ${res}`)
        return res
      })
      .catch(PROMISE_CATCH_METHOD)
  }

  async appendBytesToFile(
    name: string,
    content: string | Buffer,
    options?: SaveOptions
  ): Promise<void> {
    this.currentName = name

    // acts in the same way as a Firebase transaction but weaker since the only concerned variable, which is
    // content size, could be super big and is hard to check its validity
    return retry(async ()=>{
      const file = this.bucket.file(this.path)
      if((await file.exists())[0]) return
      
      // get hash
      const initialHash = (await file.getMetadata())[0].md5Hash

      // download content and append new content to the buffer
      // this will be costly if the file to append content to sized up to gigs
      const [oldContent] = await file.download()
      if(typeof(content) !== 'string') content = content.toString(this.encoding)
      oldContent.write(content, this.encoding)

      // now verify the file by comparing MD5 hash of both files. They should be the same to each other.
      // if false then retry, else save the file gracefully
      if(initialHash != (await file.getMetadata())[0].md5Hash) return Promise.reject()
      
      return file.save(oldContent, options)
        .then(res => {
          logger.info(`Storage service: Uploaded file named ${this.path} to the bucket with response: ${res}`)
          return res
        })
    }).catch(PROMISE_CATCH_METHOD)
  }

  async deleteFileFromStorage(name: string): Promise<DeleteFileResponse> {
    this.currentName = name
    return await this.bucket.file(this.path).delete({ ignoreNotFound: true })
      .then(res => (logger.info(`Storage service: Deleted file named ${name}`), res))
      .catch(PROMISE_CATCH_METHOD)
  }

  async deleteFolderFromStorage(folderName: string): Promise<void> {
    this.currentName = folderName
    await this.bucket.deleteFiles({ prefix: this.path })
      .then(res => (logger.info(`Storage service: Deleted folder with directory of ${folderName}`), res))
      .catch(PROMISE_CATCH_METHOD)
  }
}