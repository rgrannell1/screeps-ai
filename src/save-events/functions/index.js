
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const {ScreepsAPI} = require('screeps-api')
const constants = require('./constants')

function processEvents (events) {
  if (!events) {
    console.log('memory.events missing.')
  }
  return Promise.resolve(events)
}

function writeResults (db, res, writeable) {
  const content = {}

  db.push(content).then(() => {
    res.send(`Wrote ${writeable.length} results`)
  })
}

function storeEvents (db, res) {
  const api = new ScreepsAPI({
    token: constants.env.token
  })

  api.memory.get(undefined, constants.shard)
    .then(memory => {
      return processEvents(memory.events)
    })
    .then(data => {
      return writeResults(db, res, data)
    })
    .then(
      err => console.log(error),
      () => api.memory.set('events', [])
    )
}

exports.saveEvents = functions.https.onRequest((req, res) => {
  admin.initializeApp()
  const db = admin.database().ref('events')

  storeEvents(db, res)
})
