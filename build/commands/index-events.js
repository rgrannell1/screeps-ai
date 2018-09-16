
const path = require('path')
const pulp = require('@rgrannell/pulp')
const showEvents = require('../../src/show-events/index.js')

const command = {
  name: 'index-events',
  dependencies: []
}

command.cli = `
Usage:
  script index-events
Description:
  index-events
`

command.task = async (args, emitter) => {
  const fpath = path.join(__dirname, '../../src/save-events')

  emitter.emit(pulp.events.subTaskProgress, `starting to deploy "${fpath}"`)

  await showEvents(emitter, pulp.events.subTaskProgress)

  emitter.emit(pulp.events.subTaskProgress, `finished deploying "${fpath}"!`)
}

module.exports = command
