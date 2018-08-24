
const path = require('path')
const eslint = require('eslint')

const command = {
  name: 'lint',
  dependencies: []
}

command.cli = `
Usage:
  script lint [--fix]
Description:
  lint
`

command.task = async args => {
  const root = path.resolve(`${__dirname}/../../`)
  const cli = new eslint.CLIEngine({})
  const data = cli.executeOnFiles([root])

  const formatter = eslint.CLIEngine.getFormatter()

  console.log(formatter(data.results))
}

module.exports = command
