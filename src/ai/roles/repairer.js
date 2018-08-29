
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')
const senses = require('./parts/senses')
const states = require('./parts/states')

const roleStates = {
  SEEKING_CHARGE: states.SEEKING_CHARGE(),
  CHARGE: states.CHARGE(),
  REPAIR: states.REPAIR(),
  SEEKING_DAMAGE: states.SEEKING_DAMAGE()
}

module.exports = Role(roleStates, {
  initalState: 'SEEKING_CHARGE'
})
