
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
      senses.shouldSeekSite,
      senses.isDepleted
    ]
  },
  SEEKING_SITE: {
    do: actions.SEEKING_SITE,
    code: 'SEEK_SITE',
    until: [
      senses.atSite
    ]
  },
  BUILDING: {
    do: actions.BUILDING,
    until: [
      senses.isDepletedCharge
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_CHARGE'
})
