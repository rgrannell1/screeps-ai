
const path = require('path')
const pulp = require('@rgrannell/pulp')
const request = require('request-promise-native')

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
  await request.get('https://us-central1-screeps-ai.cloudfunctions.net/saveEvents')
  emitter.emit(pulp.events.subTaskProgress, 'done')
}

module.exports = command
