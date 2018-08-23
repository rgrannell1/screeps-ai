
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')
const senses = require('./parts/senses')

const states = {
  SEEKING_CHARGE: {
    do: actions.SEEKING_CHARGE,
    code: 'SEEK_CHG',        
    until: [
      senses.shouldSeekCharge,
      senses.atCharge
    ]
  },
  CHARGE: {
    do: actions.CHARGE,
    until: [
      senses.shouldSeekDamage,
      senses.isDepletedCharge
    ]
  },
  SEEKING_DAMAGE: {
    code: 'SEEK_DMG',        
    do: actions.SEEKING_DAMAGE,
    until: [
      senses.atDamage
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_CHARGE'
})
