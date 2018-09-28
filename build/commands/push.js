
const fs = require('fs').promises
const path = require('path')
const pulp = require('@rgrannell/pulp')
const request = require('request-promise-native')
const {exec} = require('child_process')

const command = {
  name: 'push',
  dependencies: ['build', 'upload']
}

command.cli = `
Usage:
  script push
Description:
  push
`

module.exports = command
