
const fs = require('fs').promises
const sqlite = require('sqlite')
const path = require('path')
const admin = require('firebase-admin')

const config = {
  apiKey: process.env.FIREBASE_TOKEN,
  authDomain: "screeps-ai.firebaseio.com",
  databaseURL: "https://screeps-ai.firebaseio.com",
  storageBucket: "bucket.appspot.com"
}

const app = admin.initializeApp(config)

const sql = {}

sql.createTable = 'CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, content BLOB NOT NULL);'
sql.insertEntry = 'INSERT INTO events(id, content) VALUES(?, ?)'

async function main () {
  const db = admin.database()
  const ref = db.ref('events')
  const fpath = path.join(__dirname, '../../data/screeps-events.sqlite')

  try {
    await fs.unlink(fpath)
  } catch (err) {}

  const sqlDb = await sqlite.open(fpath, {Promise})
  await sqlDb.run(sql.createTable)

  const snapshot = await ref.once('value')
  const events = snapshot.val()

  if (!events) {
    return
  }

  Object.entries(events).forEach(async ([id, data]) => {
    try {
      const content = Object.assign({}, data, {id})
      await sqlDb.run(sql.insertEntry, [id, JSON.stringify(content, null, 2)])
    } catch (err) {
      console.log(err)
      console.log('***')
    }
  })

  await app.delete()
}

module.exports = main
