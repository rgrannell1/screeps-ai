
const fs = require('fs').promises
const loki = require('lokijs')
const path = require('path')
const admin = require('firebase-admin')

const config = {
  apiKey: process.env.FIREBASE_TOKEN,
  authDomain: "screeps-ai.firebaseio.com",
  databaseURL: "https://screeps-ai.firebaseio.com",
  storageBucket: "bucket.appspot.com"
}

const app = admin.initializeApp(config)

async function main () {
  const db = admin.database()
  const ref = db.ref('events')
  const fpath = path.join(__dirname, '../../data/screeps-events.json')

  try {
    await fs.unlink(fpath)
  } catch (err) {}

  const lk = new loki(fpath)

  const lkEvents = lk.addCollection('events')
  const snapshot = await ref.once('value')
  const events = snapshot.val()

  Object.entries(events).forEach(([id, data]) => {
    lkEvents.insert(Object.assign({}, data, {id}))
  })

  lk.saveDatabase()
  await app.delete()

  // -- because loki is terrible.
  return new Promise(resolve => {
    setTimeout(resolve, 500)
  })
}

module.exports = main
