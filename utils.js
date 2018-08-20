
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

  return site
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
  const target = creepUtils.findSource(creep)
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
    creep.moveTo(creep.room.controller)
    return
  }

  const code = creep.upgradeController(creep.room.controller)
  if (code !== OK) {
    console.log(`not upgrading; code ${code}`)
  } else {
    creep.say(`${icon} Upgrading`)
  }
}

creepUtils.moveToClosestSite = creep => {
  const {icon} = creep.memory
  const site = creepUtils.findNearestConstructionSite(creep)

  if (site) {
    if(creep.build(site) == ERR_NOT_IN_RANGE) {
      creep.moveTo(site)
    } else {
      creep.say(`${icon} Build!`)
    }
  }
}

const sourceUtils = {}

sourceUtils.countOpenings = source => {

}

const miscUtils = {}

miscUtils.buildRoad = ({room, source, target, roomName}) => {
  const roadPath = room.findPath(source, target, {
    ignoreCreeps: true,
    ignoreRoads: true
  })

  for (const {x, y} of roadPath) {
    const pos = new RoomPosition(x, y, roomName)
    pos.createConstructionSite(STRUCTURE_ROAD)
  }
}

module.exports = {
  creepUtils,
  sourceUtils,
  miscUtils
}
