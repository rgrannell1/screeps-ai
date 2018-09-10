
const fs = require('fs').promises
const path = require('path')
const pulp = require('@rgrannell/pulp')
const request = require('request-promise-native')
const {exec} = require('child_process')

const command = {
  name: 'upload',
  dependencies: []
}

command.cli = `
Usage:
  script upload
Description:
  upload
`

command.task = async (args, emitter) => {
  const content = await fs.readFile(path.join(__dirname, '../../dist/main.js'))
  const main = content.toString()

  emitter.emit(pulp.events.subTaskProgress, `loaded "main.js"`)

  const result = await request({
    method: 'POST',
    url: `https://screeps.com/api/user/code`,
    headers: {
      'X-Token': process.env.SCREEPS_TOKEN,
      'Content-Type': 'application/json; charset=utf-8'
    },
    json: {
      branch: 'default',
      modules: {main}
    }
  })

  emitter.emit(pulp.events.subTaskProgress, `successfully uploaded "main.js" to screeps`)
}

module.exports = command
