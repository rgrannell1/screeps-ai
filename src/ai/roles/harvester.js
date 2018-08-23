
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
      senses.shouldSeekSpawn,
      senses.atSource
    ]
  },
  HARVEST: {
    do: actions.HARVEST,
    until: [
      senses.shouldSeekSpawn,
      senses.atSource,
      senses.isDepletedSource
    ]
  },
  SEEKING_SPAWN: {
    do: actions.SEEKING_SPAWN,
    until: [
      senses.atSpawn
    ]
  },
  CHARGE_SPAWN: {
    do: actions.CHARGE_SPAWN,
    until: [
      senses.isDepletedSource
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_SOURCE'
})
