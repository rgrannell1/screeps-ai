
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')
const senses = require('./parts/senses')

const states = {
  SEEKING_CHARGE: {
    do: actions.SEEKING_CHARGE,
    code: '🚚⚡',
    until: [
      senses.shouldSeek.charge,
      senses.atCharge
    ]
  },
  CHARGE: {
    do: actions.CHARGE,
    code: '+⚡',
    until: [
      senses.shouldSeek.damage,
      senses.isDepleted.needsCharge
    ]
  },
  REPAIR: {
    code: '+❤',
    do: actions.REPAIR,
    until: [
      senses.repairComplete,
      senses.isDepleted.needsCharge,
    ]
  },
  SEEKING_DAMAGE: {
    code: '🚚❤',
    do: actions.SEEKING_DAMAGE,
    until: [
      senses.isDepleted.needsCharge,
      senses.atDamage
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_CHARGE'
})
