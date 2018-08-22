
const constants = require('./constants')
const creepUtils = {}

creepUtils.findSource = creep => {
  if (creep.memory.sourceId) {
    return Game.getObjectById(creep.memory.sourceId)
  } else {
    const [source] = creep.room.find(FIND_SOURCES)
    creep.memory.sourceId = source.id
    return source
  }
}

creepUtils.findNearestConstructionSite = creep => {
  const sites = creep.room.find(FIND_CONSTRUCTION_SITES)
  if (sites.length === 0) {
    return null
  }

  const ranges = sites.map(site => {
    return {creep, site, distance: creep.pos.getRangeTo(site)}
  })

  const site = ranges.reduce((min, current) => {
    return current.distance < min.distance ? current : min
  })

  return site.site
}

creepUtils.moveToTarget = (creep, target) => {
  const {icon} = creep.memory

  if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target)
  } else {

  }
}

creepUtils.chargeAtSpawn = (creep, spawn) => {
  const minimumCharge = 0
  if (spawn.energy < minimumCharge) {
    return
  }

  if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(spawn)
  }
}

creepUtils.repairRoads = creep => {
  const roads = creep.room.find(FIND_STRUCTURES, {
    filter (object) {
      return object.structureType === STRUCTURE_ROAD && (object.hits < (object.hitsMax / 4))
    }
  })

  console.log(roads)

  creep.moveTo(roadToRepair);
  creep.repair(roadToRepair);
}

creepUtils.transferEnergyToSpawn = creep => {
  const {icon} = creep.memory

  const spawn = Game.spawns['Spawn1']

  if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    const moveStatus = creep.moveTo(spawn)
  } else {

  }
}

creepUtils.moveToSpawn = creep => {
  const {icon} = creep.memory

  if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(Game.spawns['Spawn1'])
  } else {
    creep.say(`${icon} At spawn`)
  }
}

creepUtils.moveToClosestSite = creep => {
  const {icon} = creep.memory
  const site = creepUtils.findNearestConstructionSite(creep)

  if (site) {
    const buildCode = creep.build(site)
    if (buildCode === ERR_NOT_IN_RANGE) {
      creep.moveTo(site)
    } else if (buildCode !== 0) {
      creep.say(`${icon} No ${buildCode}`)
    }
  }
}

creepUtils.creepExists = role => {
  return Object.keys(Game.creeps).some(creepName => {
    return Game.creeps[creepName].memory.role === role
  })
}

const sourceUtils = {}

const miscUtils = {}

miscUtils.getCreepCost = parts => {
  return parts.reduce((sum, part) => {
    return sum + constants.costs[part]
  }, 0)
}

module.exports = {
  creepUtils,
  sourceUtils,
  miscUtils
}
