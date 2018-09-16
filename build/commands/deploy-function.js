
const path = require('path')
const pulp = require('@rgrannell/pulp')
const {exec} = require('child_process')
const client = require('firebase-tools')

const command = {
  name: 'deploy-function',
  dependencies: []
}

command.cli = `
Usage:
  script deploy-function
Description:
  deploy-function
`

command.task = async (args, emitter) => {
  const fpath = path.join(__dirname, '../../src/save-events')

  emitter.emit(pulp.events.subTaskProgress, `starting to deploy "${fpath}"`)

  await client.deploy({
    project: 'screeps-ai',
    cwd: fpath
  })

  emitter.emit(pulp.events.subTaskProgress, `finished deploying "${fpath}"!`)
}

module.exports = command
