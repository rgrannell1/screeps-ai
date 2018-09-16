
const loki = require('lokijs')
const path = require('path')
const admin = require('firebase-admin')

const config = {
  apiKey: process.env.FIREBASE_TOKEN,
  authDomain: "screeps-ai.firebaseio.com",
  databaseURL: "https://screeps-ai.firebaseio.com",
  storageBucket: "bucket.appspot.com"
}

admin.initializeApp(config)

async function main () {
  const database = admin.database().ref('events')
  const lk = new loki(path.join(__dirname, '../../data/screeps-events.json'))
  const lkEvents = lk.addCollection('events')

  const snapshot = await database.once('value')
  const events = snapshot.val()

  Object.entries(events).forEach(([id, data]) => {
    lkEvents.insert(Object.assign({}, data, {id}))
  })

  lk.saveDatabase()
  process.exit(0)
}

main()
