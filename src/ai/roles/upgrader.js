
const Role = require('./role')
const misc = require('../misc')
const actions = require('./parts/actions')

const senses = {}

senses.shouldSeekSource = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_CONTROLLER'
  } else {
    return 'SEEKING_SOURCE'
  }
}

senses.shouldSeekController = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_CONTROLLER'
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

senses.atController = creep => {
  const controller = Game.getObjectById(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.upgradeController(controller), {
    [OK]: () => 'UPGRADING',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CONTROLLER'
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
  SEEKING_CONTROLLER: {
    do: actions.SEEKING_CONTROLLER,
    until: [
      senses.atController
    ]
  },
  UPGRADING: {
    do: actions.UPGRADING,
    until: [
      senses.isDepleted,
      senses.idle
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_SOURCE'
})
