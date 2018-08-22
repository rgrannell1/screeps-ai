
const Role = require('./role')
const misc = require('../misc')

/*
  ==================== Actions ====================
*/

const actions = {}

actions.SEEKING_SOURCE = creep => {
  delete creep.memory.spawnId

  if (!creep.memory.sourceId) {
    var source = creep.pos.findClosestByRange(FIND_SOURCES)
  }

  if (source && source.id) {
    creep.memory.sourceId = source.id
    creep.moveTo(Game.getObjectById(creep.memory.sourceId))
  }
}

actions.HARVEST = creep => {
  const harvestCode = creep.harvest(Game.getObjectById(creep.memory.sourceId))

  misc.switch(harvestCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_SOURCE'
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

actions.SEEKING_SPAWN = creep => {
  const spawn = Game.spawns['Spawn1']

  delete creep.memory.sourceId
  const spawnId = creep.memory.hasOwnProperty('spawnId')
    ? creep.memory.spawnId
    : spawn.id

  creep.memory.spawnId = spawnId
  const moveCode = creep.moveTo(Game.getObjectById(spawnId))
  misc.switch(moveCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

actions.CHARGE_SPAWN = creep => {
  const upgradeCode = creep.transfer(Game.getObjectById(creep.memory.spawnId), RESOURCE_ENERGY)
  misc.switch(upgradeCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_SPAWN'
    },
    default: code => {
      console.log(code)
    }
  })
}

/*
  ==================== Senses ====================
*/

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
