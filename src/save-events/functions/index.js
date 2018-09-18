
const uuidv4 = require('uuid/v4')
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

  const setteable = {}
  writeable.forEach(datum => {
    setteable[uuidv4()] = datum
  })

  return db.set(setteable).then(() => {
    const from = writeable.reduce((acc, current) => Math.min(acc, current.time), Infinity)
    const to = writeable.reduce((acc, current) => Math.max(acc, current.time), -Infinity)
    const count = writeable.length

    const response = {count, characters: 0}
    if (writeable.length > 0) {
      response.from = new Date(from).toLocaleString()
      response.to = new Date(to).toLocaleString()
      response.characters = JSON.stringify(writeable).length
    }

    res.send(JSON.stringify(response, null, 2))
  })
}

function clearEvents (api) {
  return api.memory.set('events', [], constants.shard)
}

function storeEvents (db, res) {
  const api = new ScreepsAPI({token: constants.env.token})

  return api.memory.get(undefined, constants.shard)
    .then(memory => {
      return processEvents(memory)
    })
    .then(data => {
      return writeResults(db, res, data)
    })
    .then(
      err => {
        console.error(err)
        return clearEvents(api)
      },
      () => {
        return clearEvents(api)
      }
    )
}

admin.initializeApp()

exports.saveEvents = functions.https.onRequest((req, res) => {
  const db = admin.database().ref('events')

  storeEvents(db, res)
    .catch(err => {
      console.error(err)
    })
})
