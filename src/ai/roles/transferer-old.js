
const Role = require('../models/role')
const misc = require('../misc')
const actions = require('./parts/actions')
const senses = require('./parts/senses')
const states = require('./parts/states')

const roleStates = {
  SEEKING_CONTAINER: {
    code: '🚚📦',
    do: actions.SEEKING_CONTAINER,
    until: [
      senses.canWithdrawFromContainer
    ]
  },
  DRAIN_CONTAINER: states.DRAIN_CONTAINER(),
  SEEKING_SPAWN: states.SEEKING_SPAWN(),
  CHARGE_SPAWN: {
    code: '-⚡',
    do: actions.CHARGE_SPAWN,
    until: [
      senses.isDepleted.needsContainer,
      senses.atContainerFromSpawn
    ]
  },
  CHARGE_EXTENSION: states.CHARGE_EXTENSION()
}

module.exports = Role(roleStates, {
  initalState: 'SEEKING_CONTAINER'
})
