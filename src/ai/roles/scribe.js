
const Role = require('./role')
const actions = require('./parts/actions')
const senses = require('./parts/senses')
const states = require('./parts/states')

const roleStates = {
  SEEKING_CONTROLLER: states.SEEKING_CONTAINER(),
  SIGNING: states.SIGNING(),
  DYING: states.DYING()
}

module.exports = Role(roleStates, {
  initalState: 'SEEKING_CONTROLLER'
})
