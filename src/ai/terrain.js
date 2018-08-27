
const terrain = {}

const lookAtPos = pos => {
  return pos.look()
}

terrain.is = {}

terrain.is.plain = pos => {
  const summary = lookAtPos(pos)
  return summary.length === 1 && summary[0].terrain === 'plain'
}

terrain.is.wall = pos => {
  const summary = lookAtPos(pos)
  return summary.length === 1 && summary[0].terrain === 'wall'
}

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

terrain.getMap = roomName => {
  const tiles = Game.rooms[roomName].lookForAtArea(
    LOOK_TERRAIN,
    0,
    0,
    49,
    49,
    true
  )

  return tiles
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

terrain.getExitTiles = roomName => {
  const bounds = {
    x: {lower: 0, upper: 49},
    y: {lower: 0, upper: 49}
  }

  const tiles = []

  for (let x = 0; x <= bounds.x.upper; x++) {
    for (let y = 0; y <= bounds.y.upper; y++) {
      let isValid = {
        x: x === bounds.x.lower || x === bounds.x.upper,
        y: y === bounds.y.lower || y === bounds.y.upper,
      }


      if (isValid.x || isValid.y) {
        tiles.push(new RoomPosition(x, y, roomName))
      }
    }
  }

  return tiles.filter(tile => {
    return terrain.is.plain(tile)
  })
}

terrain.findSources = roomName => {
  const room = Game.rooms[roomName]
  return room.find(FIND_SOURCES)
}


terrain.getSourceQuality = source => {
  const surrounding = terrain.getBorder(source.pos, 1)

  return
  return surrounding.filter(tile => {
    return !terrain.is.wall(tile)
  }).length
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
      const isContainer = item.structureType === STRUCTURE_CONTAINER

      if (isContainer) {
        return item.store.energy < CONTAINER_CAPACITY
      }
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
      const isHalfDead = (object.hits < (7 * (object.hitsMax / 8)))

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
