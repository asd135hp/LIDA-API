import { setTimeout } from "timers/promises";
import { TEST_ACCOUNT } from "../../constants";
import User from "../../model/v1/auth/user";
import { asymmetricKeyDecryption } from "../../utility/encryption";
import { persistentFirebaseConnection } from "../v1/services/firebaseFreetier/firebaseService";

describe("Test firebase service as a whole", ()=>{
  const service = persistentFirebaseConnection
  // 1 minutes
  const TIMEOUT = 1000 * 10

  // storage is only used by the server so parallel testing is not needed here ???
  test("Test firebase storage service", async ()=>{
    const storage = service?.storageService
    if(!storage) return;

    const testFile = "text1.txt"

    await storage.uploadBytesToStorage("Hello", testFile).catch(reason => expect(reason).toBe(undefined))

    await storage.readFileFromStorage(testFile)
      .then(result => {
        expect(result).not.toBe(undefined)
        expect(result.length).not.toBe(0)
        // need further assertions here
      })
      .catch(reason => expect(reason).toBe(undefined))

    // since uploading file succeeded, now trying to delete the file
    await storage.deleteFileFromStorage(testFile).catch(reason => expect(reason).toBe(null))

    await storage.readFileFromStorage(testFile)
      .then(result => {
        expect(result).toBe(undefined)
      })
      .catch(reason => expect(reason).not.toBe(null))
  }, TIMEOUT)

  describe("Test firebase firestore database", ()=>{
    const documentPath = "test/test1"
    const firestore = service.firestoreService

    test("Should create a document in the database", async ()=>{
      await firestore.createDocument(documentPath, { "value": "Hello" })
      const document = await firestore.getDocument(documentPath)
      expect(document).not.toBe(undefined)
      expect(document.get("value")).toBe("Hello")
    }, TIMEOUT)

    test("Should update the document in the database", async ()=>{
      await firestore.updateDocument(documentPath, { "val": "1" })
      const document = await firestore.getDocument(documentPath)
      expect(document).not.toBe(undefined)
      expect(document.get("value")).toBe("Hello")
      expect(document.get("val")).toBe(undefined)
    }, TIMEOUT)

    test("Should set the document in the database", async ()=>{
      await firestore.setDocument(documentPath, { "j": "k" })
      const document = await firestore.getDocument(documentPath)
      expect(document).not.toBe(undefined)
      expect(document.get("j")).toBe("k")
      expect(document.get("value")).not.toBe("Hello")
      expect(document.get("idle")).not.toBe("true")  
    }, TIMEOUT)

    test("Should delete the document in the database", async ()=>{
      await firestore.deleteDocument(documentPath)
      expect((await firestore.getDocument(documentPath)).data()).toBe(undefined)  
    }, TIMEOUT)
  })

  describe("Test firebase realtime database", ()=>{
    const path = "test"
    const realTime = service.realtimeService

    test("Should set new content to the database", async ()=>{
      await realTime.setContent({ "test": "Hello" }, path)
      const contentSet = await realTime.getContent(path)
      expect(contentSet.exists()).toBe(true)
      expect(contentSet.hasChild("test")).toBe(true)
      expect(contentSet.numChildren()).toBe(1)
      expect(typeof(contentSet.val())).toBe("object")
      expect(contentSet.val()['test']).toBe("Hello")
    }, TIMEOUT)

    test("Should push new content to the database", async ()=>{
      const key = await realTime.pushContent({ "test1": "Test123" }, path).then(ref => ref.key)
      const contentPush = await realTime.getContent(path, ref => ref.child(key).get())
      expect(contentPush.exists()).toBe(true)
      expect(contentPush.hasChild("test1")).toBe(true)
      expect(contentPush.numChildren()).toBe(1)
      expect(typeof(contentPush.val())).toBe("object")
      expect(contentPush.val()['test1']).toBe("Test123")
    }, TIMEOUT)

    test("Should update new content to the database", async ()=>{
      await realTime.updateContent({ "test": "GoodBye" }, path)
      const contentUpdate = await realTime.getContent(path)
      expect(contentUpdate.exists()).toBe(true)
      expect(contentUpdate.hasChild("test")).toBe(true)
      expect(typeof(contentUpdate.val())).toBe("object")
      expect(contentUpdate.val()['test']).toBe("GoodBye")
    }, TIMEOUT)

    test("Should delete content from the database", async ()=>{
      await realTime.deleteContent(`${path}/test`)
      const contentDelete = await realTime.getContent(path)
      expect(contentDelete.exists()).toBe(true)
      expect(contentDelete.hasChild("test")).not.toBe(true)
      expect(typeof(contentDelete.val())).toBe("object")
      expect(contentDelete.val()['test']).not.toBe("Hello")
    }, TIMEOUT)
  })

  test("Test firebase authentication", async ()=>{
    const auth = service?.authService
    if(!auth) return;

    const { email, password } = TEST_ACCOUNT
    // first register
    await auth.registerWithEmail(email, password).catch(async()=>{
      console.log("Failed to register")
    })
    
    // wait 5 sec since this is not a realtime database
    await setTimeout(TIMEOUT)

    // second login
    let user: User = await auth.loginWithEmail(email, password).catch(()=>null)
    expect(user).not.toBe(null)
    expect(user.email).toBe(email)
    
    // third verify api key
    const [uid, apiKey] = asymmetricKeyDecryption(Buffer.from(user.accessToken, 'hex')).split("|")
    expect(await auth.verifyApiKey(uid, apiKey)).toBe(true)
    
    // fourth reauthentication
    // (which could be hard to do since the expirary duration for api keys are 30 days)
    user = await auth.reauthenticationWithEmail(email, password)
    const [_, newApiKey] = asymmetricKeyDecryption(Buffer.from(user.accessToken, 'hex')).split("|")
    expect(newApiKey).not.toBe(apiKey)

    // delete user first
    await auth.deleteUser(uid, newApiKey)

    // finally logging out
    auth.logout(user)
    expect(user.isLoggedOut).toBe(true)
  }, TIMEOUT * 3)
})