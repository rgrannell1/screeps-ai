
const Role = require('./role')
const actions = require('./parts/actions')
const senses = require('./parts/senses')
const states = require('./parts/states')

const roleStates = {
  SEEKING_SOURCE: states.SEEKING_SOURCE(),
  HARVEST: states.HARVEST(),
  SEEKING_SPAWN: states.SEEKING_SPAWN(),
  SEEKING_CONTAINER: states.SEEKING_CONTAINER(),
  CHARGE_SPAWN: states.CHARGE_SPAWN(),
  CHARGE_CONTAINER: states.CHARGE_CONTAINER()
}

module.exports = Role(roleStates, {
  initalState: 'SEEKING_SOURCE'
})
