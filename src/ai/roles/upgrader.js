
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')
const senses = require('./parts/senses')

/*
  ==================== States ====================
*/

const states = {
  SEEKING_SOURCE: {
    do: actions.SEEKING_SOURCE,
    code: 'SEEK_SRC',
    until: [
      senses.shouldSeek.controller,
      senses.atSource
    ]
  },
  HARVEST: {
    do: actions.HARVEST,
    until: [
      senses.shouldSeek.controller,
      senses.atSource,
      senses.isDepleted.needsSource
    ]
  },
  SEEKING_CONTROLLER: {
    code: 'SEEK_CTRL',
    do: actions.SEEKING_CONTROLLER,
    until: [
      senses.atController
    ]
  },
  UPGRADING: {
    do: actions.UPGRADING,
    until: [
      senses.isDepleted.needsSource
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_SOURCE'
})
