
const path = require('path')
const pulp = require('@rgrannell/pulp')
const request = require('request-promise-native')

const constants = {
  urls: {
    saveEvents: 'https://us-central1-screeps-ai.cloudfunctions.net/saveEvents'
  }
}

const command = {
  name: 'save-events',
  dependencies: []
}

command.cli = `
Usage:
  script save-events

Description:
  save-events
`

command.task = async (args, emitter) => {
  emitter.emit(pulp.events.subTaskProgress, 'saving screeps events')

  const response = await request.get(constants.urls.saveEvents)
  const parsed = JSON.parse(response)
  const message = parsed.count === 0
    ? 'no events retrieved'
    : `retrieved ${parsed.count} events from ${parsed.from} to ${parsed.to}`

  emitter.emit(pulp.events.subTaskProgress, message)

  return new Promise(resolve => {
    setTimeout(resolve, 1000)
  })

}

module.exports = command
