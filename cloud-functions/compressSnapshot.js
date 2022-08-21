const { Firestore } = require("@google-cloud/firestore")
const { Storage }= require("@google-cloud/storage")

const firestore = new Firestore({ projectId: process.env.GOOGLE_CLOUD_PROJECT })
const storage = new Storage({ projectId: process.env.GOOGLE_CLOUD_PROJECT })

exports.compressSnapshot = event => {
  console.log(event)
}