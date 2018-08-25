
const terrain = {}

terrain.getBlock = (centre, dist) => {
  const bounds = {
    x: {
      lower: Math.max(0, centre.x - dist),
      upper: centre.x + dist
    },
    y: {
      lower: Math.max(0, centre.y - dist),
      upper: centre.y + dist
    }
  }

  const terrain = Game.rooms[centre.roomName].lookForAtArea(
    LOOK_TERRAIN,
    bounds.y.lower,
    bounds.x.lower,
    bounds.y.upper,
    bounds.x.upper,
    true
  )

  return terrain
}

terrain.getBorder = (centre, dist) => {
  const bounds = {
    x: {
      lower: Math.max(0, centre.x - dist),
      upper: centre.x + dist
    },
    y: {
      lower: Math.max(0, centre.y - dist),
      upper: centre.y + dist
    }
  }

  const tiles = terrain.getBlock(centre, dist)

  return tiles.filter(tile => {
    const isValid = {
      x: tile.x === bounds.x.lower || tile.x === bounds.x.upper,
      y: tile.y === bounds.y.lower || tile.y === bounds.y.upper
    }
    return isValid.x && isValid.y
  })
}

terrain.isPlain = pos => {
  return room.lookAt(pos).some(entry => entry.terrain === 'plain')
}

terrain.isWall = pos => {
  return room.lookAt(pos).some(entry => entry.terrain === 'wall')
}

terrain.findSources = roomName => {
  const room = Game.rooms[roomName]
  return room.find(FIND_SOURCES)
}

terrain.findMinerals = roomName => {
  const room = Game.rooms[roomName]
  return room.find(FIND_MINERALS)
}

terrain.findClosestSource = pos => {
  return pos.findClosestByRange(FIND_SOURCES)
}

terrain.findSpawns = roomName => {
  return Object.values(Game.spawns)
}

terrain.findRoads = roomName => {
  const room = Game.rooms[roomName]

  return room.find(FIND_STRUCTURES, {
    filter: object => object.structureType === STRUCTURE_ROAD
  })
}

terrain.findController = roomName => {
  return Game.rooms[roomName].controller
}

terrain.findContainers = roomName => {
  const room = Game.rooms[roomName]
  return room.find(FIND_STRUCTURES, {
    filter (item) {
      return item.structureType === STRUCTURE_CONTAINER
    }
  })
}

terrain.findClosestContainer = pos => {
  return pos.findClosestByRange(FIND_STRUCTURES, {
    filter (item) {
      return item.structureType === STRUCTURE_CONTAINER
    }
  })
}

terrain.findDamagedStructure = roomName => {
  const room = Game.rooms[roomName]

  const REASONABLE_DAMAGE = 250
  const isRepairable = new Set([STRUCTURE_EXTENSION, STRUCTURE_ROAD])
  return room.find(FIND_STRUCTURES, {
    filter (object) {
      const shouldFix = isRepairable.has(object.structureType)
      const hasReasonableDamage = (object.hitsMax - object.hits) > REASONABLE_DAMAGE
      const isHalfDead = (object.hits < (object.hitsMax / 2))

      return shouldFix && (hasReasonableDamage || isHalfDead)
    }
  })
}

terrain.exists = {};

terrain.exists.container = roomName => {
  const room = Game.rooms[roomName]

  const container = room.find(FIND_STRUCTURES, {
    filter (item) {
      return item.structureType === STRUCTURE_CONTAINER
    }
  })

  return container.length > 0
}

module.exports = terrain
