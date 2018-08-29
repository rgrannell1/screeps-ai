
const Role = require('./role')
const actions = require('./parts/actions')
const senses = require('./parts/senses')
const states = require('./parts/states')

const roleStates = {
  SEEKING_SOURCE: {
    do: actions.SEEKING_SOURCE,
    code: '🚚⚡',
    until: [
      senses.shouldSeek.container,
      senses.shouldSeek.spawn,
      senses.atSource
    ]
  },
  HARVEST: {
    do: actions.HARVEST,
    code: '⛏',
    until: [
      senses.shouldSeek.emptyContainer,
      senses.shouldSeek.spawn,
      senses.atSource,
      senses.isDepleted.needsSource
    ]
  },
  SEEKING_SPAWN: {
    do: actions.SEEKING_SPAWN,
    code: '🚚🏠',
    until: [
      senses.atSpawn
    ]
  },
  SEEKING_CONTAINER: {
    do: actions.SEEKING_CONTAINER,
    code: '🚚📦',
    until: [
      senses.atContainer
    ]
  },
  CHARGE_SPAWN: {
    code: '🏠⚡',
    do: actions.CHARGE_SPAWN,
    until: [
      senses.isDepleted.needsSource
    ]
  },
  CHARGE_CONTAINER: {
    code: '📦⚡',
    do: actions.CHARGE_CONTAINER,
    until: [
      senses.targetIsFull.container,
      senses.isDepleted.needsSource
    ]
  }
}

module.exports = Role(roleStates, {
  initalState: 'SEEKING_SOURCE'
})
