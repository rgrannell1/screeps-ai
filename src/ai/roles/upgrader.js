
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')
const senses = require('./parts/senses')

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
      senses.isDepleted.needsContainer,
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
      senses.shouldSeek.controller,
      senses.isDepleted.needsContainer,
      senses.isDepleted.needsSource
    ]
  },
  UPGRADING: {
    do: actions.UPGRADING,
    until: [
      senses.isDepleted.needsContainer,
      senses.isDepleted.needsSource
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_SOURCE'
})
