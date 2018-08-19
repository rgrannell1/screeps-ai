
const constants = require('./constants')
const creepUtils = {}

creepUtils.findTarget = creep => {
  if (creep.memory.sourceId) {
    return Game.getObjectById(creep.memory.sourceId)
  } else {
    const [source] = creep.room.find(FIND_SOURCES)
    creep.memory.sourceId = source.id
    return source
  }
}

creepUtils.findMinerals = creep => {

}

creepUtils.moveToTarget = (creep, target) => {
  const {icon} = creep.memory

  if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualisePathStyle: {
        stroke: constants.pathStyles.harvestSource
      }
    })
  } else {
    creep.say(`${icon} Active`)
  }
}

creepUtils.moveToSpawn = creep => {
  const target = creepUtils.findTarget(creep)
  const {icon} = creep.memory

  if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(Game.spawns['Spawn1'], {
      stroke: constants.pathStyles.harvestSource
    })
  } else {
    creep.say(`${icon} At spawn`)
  }
}

creepUtils.moveToController = creep => {
  const {icon} = creep.memory

  if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    const code = creep.moveTo(creep.room.controller)

    if (code === OK) {
    } else {
      creep.say(`${icon} Stuck`)
    }
  } else {
    creep.say(`${icon} Upgrading`)
  }
}

module.exports = {
  creepUtils
}
