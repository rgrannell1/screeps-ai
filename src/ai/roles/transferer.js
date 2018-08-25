
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')
const senses = require('./parts/senses')

const states = {
  SEEKING_CONTAINER: {
    code: 'SEEK_CNT',
    do: actions.SEEKING_CONTAINER,
    until: [
      senses.atContainer
    ]
  },
  DRAIN_CONTAINER: {
    code: 'DRN_CNT',
    do: actions.DRAIN_CONTAINER,
    until: [
      senses.shouldSeek.spawn,
      senses.isDepleted.needsContainer,
      senses.isDepleted.needsSource
    ]
  },
  SEEKING_SPAWN: {
    do: actions.SEEKING_SPAWN,
    code: 'SEEK_SPAWN',
    until: [
      senses.atSpawn
    ]
  },
  CHARGE_SPAWN: {
    code: 'CHARGE_SPAWN',
    do: actions.CHARGE_SPAWN,
    until: [
      senses.isDepleted.needsSource
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_CONTAINER'
})
