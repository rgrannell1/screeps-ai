
const path = require('path')
const pulp = require('@rgrannell/pulp')
const downloadEvents = require('../../src/download-events/index.js')

const command = {
  name: 'download-events',
  dependencies: []
}

command.cli = `
Usage:
  script download-events

Description:
  Download events from RealTime database to a LokiJs file
`

command.task = async (args, emitter) => {
  const fpath = path.join(__dirname, '../../src/save-events')

  emitter.emit(pulp.events.subTaskProgress, `starting to download events "${fpath}"`)

  await downloadEvents(emitter, pulp.events.subTaskProgress)

  emitter.emit(pulp.events.subTaskProgress, `finished deploading events to "${fpath}"!`)
}

module.exports = command
