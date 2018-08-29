
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')
const senses = require('./parts/senses')

const states = {
  SEEKING_CONTAINER: {
    code: '🚚📦',
    do: actions.SEEKING_CONTAINER,
    until: [
      senses.containerSeekerNeedsSpawn
    ]
  },
  DRAIN_CONTAINER: {
    code: '+⚡',
    do: actions.DRAIN_CONTAINER,
    until: [
      senses.shouldSeek.spawn,
      senses.isDepleted.needsContainer
    ]
  },
  SEEKING_SPAWN: {
    do: actions.SEEKING_SPAWN,
    code: '🚚🏠',
    until: [
      senses.atSpawnFromContainer
    ]
  },
  CHARGE_SPAWN: {
    code: '-⚡',
    do: actions.CHARGE_SPAWN,
    until: [
      senses.isDepleted.needsContainer,
      senses.atContainerFromSpawn
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_CONTAINER'
})
