
const constants = require('./constants')
const {ScreepsAPI} = require('screeps-api')

function processEvents (events) {

}

async function main () {
  const api = new ScreepsAPI({
    token: process.env.SCREEPS_TOKEN
  })

  try {
    const {data} = await api.memory.get(undefined, constants.shard)
    const {events} = data
    await processEvents(events)
  } catch (err) {
    console.log(err)
  } finally {
    await api.memory.set('events', [])
  }
}

main()
