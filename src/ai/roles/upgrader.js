
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
    until: [
      senses.shouldSeekController,
      senses.atSource
    ]
  },
  HARVEST: {
    do: actions.HARVEST,
    until: [
      senses.shouldSeekController,
      senses.atSource,
      senses.isDepletedSource
    ]
  },
  SEEKING_CONTROLLER: {
    do: actions.SEEKING_CONTROLLER,
    until: [
      senses.atController
    ]
  },
  UPGRADING: {
    do: actions.UPGRADING,
    until: [
      senses.isDepletedSource
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_SOURCE'
})
