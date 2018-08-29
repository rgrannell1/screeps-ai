
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

states.SEEKING_SOURCE = () => {
  return {
    do: actions.SEEKING_SOURCE,
    code: '🚚⚡',
    until: [
      senses.shouldSeek.container,
      senses.shouldSeek.spawn,
      senses.atSource
    ]
  }
}

states.HARVEST = () => {
  return {
      do: actions.HARVEST,
      code: '⛏',
      until: [
        senses.shouldSeek.emptyContainer,
        senses.shouldSeek.spawn,
        senses.atSource,
      senses.isDepleted.needsSource
    ]
  }
}

states.SEEKING_SPAWN = () => {
  return {
    do: actions.SEEKING_SPAWN,
    code: '🚚🏠',
    until: [
      senses.atSpawn
    ]
  }
}

states.SEEKING_CONTAINER = () => {
  return {
    do: actions.SEEKING_CONTAINER,
    code: '🚚📦',
    until: [
      senses.atContainer
    ]
  }
}

states.DRAIN_CONTAINER = () => {
  return {
    code: '+⚡',
    do: actions.DRAIN_CONTAINER,
    until: [
      senses.shouldSeek.spawn,
      senses.isDepleted.needsContainer
    ]
  }
}

states.CHARGE_SPAWN = () => {
  return {
    code: '🏠⚡',
    do: actions.CHARGE_SPAWN,
    until: [
      senses.isDepleted.needsSource
    ]
  }
}

states.CHARGE_CONTAINER = () => {
  return {
    code: '📦⚡',
    do: actions.CHARGE_CONTAINER,
    until: [
      senses.targetIsFull.container,
      senses.isDepleted.needsSource
    ]
  }
}

states.REPAIR = () => {
  return {
    code: '+❤',
    do: actions.REPAIR,
    until: [
      senses.repairComplete,
      senses.isDepleted.needsCharge,
    ]
  }
}

states.SEEKING_DAMAGE = () => {
  return {
    code: '🚚❤',
    do: actions.SEEKING_DAMAGE,
    until: [
      senses.isDepleted.needsCharge,
      senses.atDamage
    ]
  }
}

states.SIGNING = () => {
  return {
    code: '✍',
    do: actions.SIGNING,
    until: [
      senses.isSigned
    ]
  }
}

states.DYING = () => {
  return {
    code: '💀',
    do: actions.DYING,
    until: []
  }
}

module.exports = states
