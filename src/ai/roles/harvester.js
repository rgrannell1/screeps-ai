
const Role = require('./role')
const actions = require('./parts/actions')
const senses = require('./parts/senses')

const states = {
  SEEKING_SOURCE: {
    do: actions.SEEKING_SOURCE,
    code: 'SEEK_SRC',
    until: [
      senses.shouldSeek.spawn,
      senses.atSource
    ]
  },
  HARVEST: {
    do: actions.HARVEST,
    until: [
      senses.shouldSeek.container,
      senses.shouldSeek.spawn,
      senses.atSource,
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
  SEEKING_CONTAINER: {
    do: actions.SEEKING_CONTAINER,
    code: 'SEEK_CNT',
    until: [
      senses.atContainer
    ]
  },
  CHARGE_SPAWN: {
    code: 'CHARGE_SPAWN',
    do: actions.CHARGE_SPAWN,
    until: [
      senses.isDepleted.needsSource
    ]
  },
  CHARGE_CONTAINER: {
    code: 'CHARGE_CONTAINER',
    do: actions.CHARGE_CONTAINER,
    until: [
      senses.isDepleted.needsSource
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_SOURCE'
})
