
const path = require('path')
const {exec} = require('child_process')

const command = {
  name: 'console',
  dependencies: []
}

command.cli = `
Usage:
  script console
Description:
  console
`

command.task = async args => {
  try {
    exec('multimeter', (err, stdout, stderr) => {
      if (err) {
        console.error(err)
      }

      stdout.pipe(process.stdout)
      stderr.pipe(process.stderr)
    })
  } catch (err) {

  } finally {

  }
}

module.exports = command
