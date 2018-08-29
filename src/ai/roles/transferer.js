
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')
const senses = require('./parts/senses')
const states = require('./parts/states')

const roleStates = {
  SEEKING_CONTAINER: {
    code: '🚚📦',
    do: actions.SEEKING_CONTAINER,
    until: [
      senses.containerSeekerNeedsSpawn
    ]
  },
  DRAIN_CONTAINER: states.DRAIN_CONTAINER(),
  SEEKING_SPAWN: states.DRAIN_CONTAINER(),
  CHARGE_SPAWN: {
    code: '-⚡',
    do: actions.CHARGE_SPAWN,
    until: [
      senses.isDepleted.needsContainer,
      senses.atContainerFromSpawn
    ]
  }
}

module.exports = Role(roleStates, {
  initalState: 'SEEKING_CONTAINER'
})
