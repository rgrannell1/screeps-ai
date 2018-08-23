
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')
const senses = require('./parts/senses')

const states = {
  SEEKING_CONTROLLER: {
    code: 'SEEK_CTRL',
    do: actions.SEEKING_CONTROLLER,
    until: [
      senses.canSignController
    ]
  },
  SIGNING: {
    do: actions.SIGNING,
    until: [
      senses.isSigned
    ]
  },
  DYING: {
    do: actions.DYING,
    until: []
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_CONTROLLER'
})
