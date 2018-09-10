
import misc from './misc'
import terrain from './terrain'

const structures = {
  any: {},
  roads: {},
  walls: {},
  container: {},
  extensions: {},
  tower: {},
  highway: {},
  is: {}
} as any

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

structures.any.place = (pos, structure, metadata) => {
  addPlan(pos, {...metadata, structure})
}

structures.roads = {}

structures.roads.place = (pos, metadata) => {
  addPlan(pos, {...metadata, structure: STRUCTURE_ROAD})
}

structures.roads.findAll = roomName => {
  return Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter (item) {
      return item.structureType === STRUCTURE_ROAD
    }
  })
}

structures.walls.findAll = roomName => {
  return Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter (item) {
      return item.structureType === STRUCTURE_WALL
    }
  })
}

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

structures.extensions.hasEnergy = extensions => {

}

structures.extensions.place = (pos, metadata) => {
  addPlan(pos, {...metadata, structure: STRUCTURE_EXTENSION})
}

structures.extensions.findAll = roomName => {
  return Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter (item) {
      return item.structureType === STRUCTURE_EXTENSION
    }
  })
}

structures.extensions.findChargeable = roomName => {

}

structures.tower.place = (pos, metadata) => {
  addPlan(pos, {...metadata, structure: STRUCTURE_TOWER})
}

structures.tower.findAll = roomName => {
  return Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
    filter (item) {
      return item.structureType === STRUCTURE_TOWER
    }
  })
}

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
    STRUCTURE_STORAGE,
    STRUCTURE_EXTENSION,
    STRUCTURE_TOWER,
    STRUCTURE_RAMPART,
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

const isEnergySource = item => {
  return misc.match(item.structureType, {
    [STRUCTURE_STORAGE] () {
      return item.room.storage.store[RESOURCE_ENERGY] > 0
    },
    default () {
      return item.energy > 0
    }
  })
}

structures.findEnergySource = (roomName:string, priorities:string[]) => {
  const buildings = Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter (item) {
      return priorities.includes(item.structureType) && isEnergySource(item)
    }
  })

  for (const prop of priorities) {
    let match = buildings.find(item => item.structureType === prop)
    if (match) {
      return {value: match}
    }
  }
}

const isEnergySink = item => {
  return misc.match(item.structureType, {
    [STRUCTURE_SPAWN] () {
      return item.energy < SPAWN_ENERGY_CAPACITY
    },
    [STRUCTURE_STORAGE] () {
      return item.room.storage.store[RESOURCE_ENERGY] < 10000
    },
    default () {
      return item.energy < item.energyCapacity
    }
  })
}

structures.findEnergySink = (roomName:string, priorities:string[]) => {
  if (!priorities) {
    throw new Error('missing priorities')
  }
  if (!priorities.includes) {
    throw new Error(`missing priorities.includes: ${JSON.stringify(priorities)}`)
  }

  const buildings = Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter (item) {
      const isPrioritiedStructure = priorities.includes(item.structureType)
      return isPrioritiedStructure && isEnergySink(item)
    }
  })

  for (const prop of priorities) {
    let match = buildings.find(item => item.structureType === prop)
    if (match) {
      return {value: match}
    }
  }
}

const isDamaged = item => {
  return misc.match(item.structureType, {
    [STRUCTURE_ROAD] () {
      return item.hits < (0.75 * item.hitsMax)
    },
    [STRUCTURE_CONTAINER] () {
      return item.hits < item.hitsMax
    },
    [STRUCTURE_EXTENSION] () {
      return item.hits < (0.9 * item.hitsMax)
    },
    [STRUCTURE_TOWER] () {
      return item.hits < (0.9 * item.hitsMax)
    },
    [STRUCTURE_RAMPART] () {
      return item.hits < 10000
    },
    [STRUCTURE_WALL] () {
      return item.hits < 10000
    },
    [STRUCTURE_STORAGE] () {
      return item.hits < (0.9 * item.hitsMax)
    },
    default () {
      return item.hits < (0.25 * item.hitsMax)
    }
  })
}

structures.findDamagedStructure = (roomName:string, priorities:string[]) => {
  const buildings = Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter (item) {
      const isPrioritiedStructure = priorities.includes(item.structureType)
      return isPrioritiedStructure && isDamaged(item)
    }
  })

  for (const prop of priorities) {
    let match = buildings.find(item => item.structureType === prop)
    if (match) {
      return match
    }
  }
}

export default structures
