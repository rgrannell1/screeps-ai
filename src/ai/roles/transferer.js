
const misc = require('../misc')
const middleware = require('./middleware')
const blessed = require('../blessed')
const {Transition, State, StateMachine, StateChange} = require('../models/updated')
const transitions = require('./parts2/transitions')
const states = require('./parts2/states')


const transferer = StateMachine({
  SEEKING_SOURCE: states.SEEKING_SOURCE,
  DRAINING_SOURCE: states.DRAINING_SOURCE,
  SEEKING_TARGET: states.SEEKING_TARGET,
  CHARGING_TARGET: states.CHARGING_TARGET
}, {
  initialState: 'SEEKING_SOURCE',
  middleware
})

module.exports = transferer
