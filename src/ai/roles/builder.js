
const Role = require('./role')
const actions = require('./parts/actions')
const senses = require('./parts/senses')

const states = {
  SEEKING_CHARGE: {
    do: actions.SEEKING_CHARGE,
    code: 'SEEK_CHG',
    until: [
      senses.shouldSeek.charge,
      senses.atCharge
    ]
  },
  CHARGE: {
    do: actions.CHARGE,
    until: [
      senses.shouldSeek.site,
      senses.isDepleted.needsCharge
    ]
  },
  SEEKING_SITE: {
    do: actions.SEEKING_SITE,
    code: 'SEEK_SITE',
    until: [
      senses.atSite,
      senses.noSitesLeft
    ]
  },
  BUILDING: {
    do: actions.BUILDING,
    until: [
      senses.isDepleted.needsCharge
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_CHARGE'
})
