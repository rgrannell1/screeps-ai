
const fs = require('fs').promises
const constants = require('./constants')
const {ScreepsAPI} = require('screeps-api')

function processEvents (events) {
  return events
}

async function writeResults (data) {
  const writeable = await data
  await fs.writeFile('../data/screeps-events.json', JSON.stringify(writeable, null, 2))
}

async function main () {
  const api = new ScreepsAPI({
    token: process.env.SCREEPS_TOKEN
  })

  try {
    const {data} = await api.memory.get(undefined, constants.shard)
    const {events} = data
    await writeResults(processEvents(events))
  } catch (err) {
    console.log(err)
  } finally {
    await api.memory.set('events', [])
  }
}

main()
