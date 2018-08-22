
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')

const senses = {}

senses.shouldSeekSource = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SPAWN'
  } else {
    return 'SEEKING_SOURCE'
  }
}

senses.shouldSeekController = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SPAWN'
  }
}

senses.atSource = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => 'HARVEST',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_SOURCE'
  })
}

senses.isDepleted = creep => {
  if (creep.carry.energy === 0) {
    return 'SEEKING_SOURCE'
  }
}

senses.atSpawn = creep => {
  const controller = Game.getObjectById(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.upgradeController(controller), {
    [OK]: () => 'CHARGE_SPAWN',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_SPAWN'
  })
}

senses.idle = creep => {
  if (creep.memory.stateTicks > 100) {
    return 'SEEKING_SOURCE'
  }
}

/*
  ==================== States ====================
*/

const states = {
  SEEKING_SOURCE: {
    do: actions.SEEKING_SOURCE,
    until: [
      senses.shouldSeekController,
      senses.atSource
    ]
  },
  HARVEST: {
    do: actions.HARVEST,
    until: [
      senses.shouldSeekController,
      senses.atSource,
      senses.isDepleted
    ]
  },
  SEEKING_SPAWN: {
    do: actions.SEEKING_SPAWN,
    until: [
      senses.atSpawn
    ]
  },
  CHARGE_SPAWN: {
    do: actions.CHARGE_SPAWN,
    until: [
      senses.isDepleted,
      senses.idle
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_SOURCE'
})
