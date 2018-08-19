
const constants = require('./constants')

const creepUtils = {}

creepUtils.findTarget = creep => {
  const sources = creep.room.find(FIND_SOURCES)
  return sources[0] // -- todo
}

creepUtils.findMinerals = creep => {
  const minerals = creep.room.find(FIND_MINERALS)
  return minerals[0] // -- todo
}

creepUtils.moveToTarget = (creep, target) => {
  const {icon='x'} = creep.memory

  if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
    creep.say(`${icon} Moving`)
    creep.moveTo(target, {
      visualisePathStyle: {
        stroke: constants.pathStyles.harvestSource
      }
    })
  } else {
    creep.say(`${icon} Processing`)
  }
}

creepUtils.moveToSpawn = creep => {
  const target = creepUtils.findTarget(creep)
  const {icon='x'} = creep.memory

  if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.say(`${icon} Moving`)
    creep.moveTo(Game.spawns['Spawn1'], {

    });
  } else {
    creep.say(`${icon} At spawn`)
  }
}


creepUtils.moveToController = creep => {
  const {icon='x'} = creep.memory

  if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    creep.say(`${icon} Moving`)
    creep.moveTo(creep.room.controller)
  } else {
    creep.say(`${icon} Upgrading`)
  }
}

module.exports = {
  creepUtils
}
