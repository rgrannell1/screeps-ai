
const terrain = require('./terrain')

const structures = {}

const addPlan = (pos, plan) => {
  if (!Memory.plans) {
    Memory.plans = []
  }

  for (let existingPlan of Memory.plans) {
    if (existingPlan.pos.x === pos.x && existingPlan.pos.y === pos.y) {
      existingPlan = {pos, plan}
      return
    }
  }

  Memory.plans.push({pos, plan})
}

structures.placePlans = () => {
  if (!Memory.plans) {
    Memory.plans = []
  }

  Memory.plans.forEach(plan => {
    try {
      const pos = new RoomPosition(plan.pos.x, plan.pos.y, plan.pos.roomName)
      pos.createConstructionSite(plan.plan.structure)
    } catch (err) {
      throw new Error(`invalid plan ${JSON.stringify(plan)}: ${err.message}`)
    }
  })
}

structures.any = {}

structures.any.place = (pos, structure, metadata) => {
  addPlan(pos, {...metadata, structure})
}

structures.roads = {}

structures.roads.place = (pos, metadata) => {
  addPlan(pos, {...metadata, structure: STRUCTURE_ROAD})
}

structures.container = {}

structures.container.hasEnergy = container => {

}

structures.container.place = (pos, metadata) => {
  addPlan(pos, {...metadata, structure: STRUCTURE_CONTAINER})
}

structures.container.findAll = roomName => {
  return Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter (item) {
      return item.structureType === STRUCTURE_CONTAINER
    }
  })
}

structures.container.findChargeable = roomName => {

}

structures.tower = {}

structures.tower.place = (pos, metadata) => {
  addPlan(pos, {...metadata, structure: STRUCTURE_TOWER})
}

structures.tower.findAll = roomName => {
  return Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
    filter: {structureType: STRUCTURE_TOWER}
  })
}

structures.highway = {}

structures.highway.place = ({room, source, target}, metadata) => {
  if (!source) throw new Error('source missing')
  if (!target) throw new Error('target missing')
  if (!metadata) throw new Error('metadata missing')
  if (!metadata.label) throw new Error('metadata.label missing')

  const roadPath = room.findPath(source, target, {
    ignoreCreeps: true,
    ignoreRoads: true
  })

  for (const {x, y} of roadPath) {
    const pos = new RoomPosition(x, y, room.name)
    addPlan(pos, {...metadata, structure: STRUCTURE_ROAD})
  }
}

structures.planExists = label => {
  const plans = Memory.plans
    ? Memory.plans
    : []
  return plans.some(({plan}) => plan.label === label)
}

structures.is = {}

structures.is.extensionSite = item => item.structureType === STRUCTURE_EXTENSION
structures.is.roadSite = item => item.structureType === STRUCTURE_ROAD
structures.is.container = item => item.structureType === STRUCTURE_CONTAINER

structures.is.damaged = site => {
  return site.hits < site.hitsMax
}

structures.findSite = roomName => {
  const sites = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES)
  const siteTypes = [
    STRUCTURE_CONTAINER,
    STRUCTURE_EXTENSION,
    STRUCTURE_TOWER,
    STRUCTURE_ROAD
  ]

  for (const siteType of siteTypes) {
    let candidate = sites.find(site => site.structureType === siteType)
    if (candidate) {
      candidate.siteType = siteType
      return candidate
    }
  }

  return sites[0]
}

structures.isSuitableEnergySource = source => {
  return true
}

structures.isSuitableEnergySink = sink => {
  return true
}

structures.findEnergySource = (roomName) => {
  const sources = {

  }
}

structures.findEnergySink = (roomName, priorities) => {
  const sinks = {
    spawns: Game.rooms[roomName].fin3(FIND_MY_SPAWNS),
    towers: structures.tower.findAll(roomName),
    containers: structures.container.findAll(roomName)
  }
}

global.structures = structures
module.exports = structures
