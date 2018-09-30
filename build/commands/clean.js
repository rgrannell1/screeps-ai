
const fs = require('fs').promises
const path = require('path')

const command = {
  name: 'clean',
  dependencies: []
}

command.cli = `
Usage:
  script clean [--watch]
Description:
  clean
`

command.task = async args => {
  const mainDist = path.resolve('../dist/main.js')

  try {
    await fs.unlink(mainDist)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
  }
}

module.exports = command
