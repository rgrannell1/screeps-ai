
const actions = require('./actions')
const senses = require('./senses')

const states = {}

states.BUILDING = () => {
  return {
    do: actions.BUILDING,
    code: '👷',
    until: [
      senses.isDepleted.needsCharge
    ]
  }
}

states.SEEKING_SITE = () => {
  return {
    do: actions.SEEKING_SITE,
    code: '🚚👷',
    until: [
      senses.atSite,
      senses.noSitesLeft
    ]
  }
}

states.CHARGE = () => {
  return {
    do: actions.CHARGE,
    code: '+⚡',
    until: [
      senses.shouldSeek.site,
      senses.isDepleted.needsCharge
    ]
  }
}

states.SEEKING_CHARGE = () => {
  return {
    do: actions.SEEKING_CHARGE,
    code: '🚚⚡',
    until: [
      senses.shouldSeek.charge,
      senses.atCharge
    ]
  }
}

module.exports = states
