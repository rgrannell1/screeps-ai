
const Role = require('../role')
const misc = require('../../misc')

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

module.exports = actions
