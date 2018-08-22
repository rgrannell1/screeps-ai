
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')

const senses = {}

senses.shouldSeekSource = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SITE'
  } else {
    return 'SEEKING_CHARGE'
  }
}

senses.shouldSeekController = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SITE'
  }
}

senses.atSource = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.CHARGE(source), {
    [OK]: () => 'CHARGE',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CHARGE'
  })
}

senses.isDepleted = creep => {
  if (creep.carry.energy === 0) {
    return 'SEEKING_CHARGE'
  }
}

senses.atSite = creep => {
  const site = Game.getObjectById(creep.memory.siteId)
  creep.moveTo(site)

  return misc.switch(creep.build(site), {
    [OK]: () => 'BUILDING',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_SITE'
  })
}

senses.atCharge = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => 'SEEKING_SITE',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CHARGE'
  })
}

senses.shouldSeekCharge = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SITE'
  } else {
    return 'SEEKING_CHARGE'
  }
}

senses.idle = creep => {
  if (creep.memory.stateTicks > 100) {
    return 'SEEKING_CHARGE'
  }
}

/*
  ==================== States ====================
*/

const states = {
  SEEKING_CHARGE: {
    do: actions.SEEKING_CHARGE,
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
    until: [
      senses.atSite
    ]
  },
  BUILDING: {
    do: actions.BUILDING,
    until: [
      senses.isDepleted
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_CHARGE'
})
