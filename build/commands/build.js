
const path = require('path')
const execa = require('execa')

const command = {
  name: 'build',
  dependencies: []
}

command.cli = `
Usage:
  script build [--watch]
Description:
  build
`

command.task = async args => {
  const root = path.resolve(`${__dirname}/../../`)
  const webpackConfig = path.resolve(`${root}/webpack.config.js`)
  let cmd = path.resolve(`${root}/node_modules/.bin/webpack --config "${webpackConfig}" --mode development`)

  if (args['--watch']) {
    cmd += ' --watch'
  }

  const buildCmd = execa.shell(cmd)
  buildCmd.stdout.pipe(process.stdout)
  buildCmd.stderr.pipe(process.stderr)

  return buildCmd
}

module.exports = command
