
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const {ScreepsAPI} = require('screeps-api')
const constants = require('./constants')

function processEvents (memory) {
  const events = memory.data.events

  if (!events) {
    console.log(`memory.events missing from ${Object.keys(memory.data)}`)
  }
  return Promise.resolve(events)
}

function writeResults (db, res, writeable) {
  if (!Array.isArray(writeable)) {
    throw new Error('non-array writeable provided')
  }

  db.push(writeable).then(() => {
    res.send(`Wrote ${writeable.length} results`)
  })
}

function storeEvents (db, res) {
  const api = new ScreepsAPI({
    token: constants.env.token
  })

  api.memory.get(undefined, constants.shard)
    .then(memory => {
      return processEvents(memory)
    })
    .then(data => {
      return writeResults(db, res, data)
    })
    .then(
      err => console.log(err),
      () => api.memory.set('events', [])
    )
}

exports.saveEvents = functions.https.onRequest((req, res) => {
  admin.initializeApp()
  const db = admin.database().ref('events')

  storeEvents(db, res)
})
