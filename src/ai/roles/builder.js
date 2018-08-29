
const Role = require('./role')
const actions = require('./parts/actions')
const senses = require('./parts/senses')
const states = require('./parts/states')

const roleStates = {
  SEEKING_CHARGE: states.SEEKING_CHARGE(),
  CHARGE: states.CHARGE(),
  SEEKING_SITE: states.SEEKING_SITE(),
  BUILDING: states.BUILDING()
}

module.exports = Role(roleStates, {
  initalState: 'SEEKING_CHARGE'
})
