
const terrain = {} as any

const lookAtPos = (pos:RoomPosition) => {
  return pos.look().filter(data => {
    return data.type !== 'flag'
  })
}

terrain.findUnexploredRooms = (roomName:string) => {
  const nearby = Game.map.describeExits(roomName)

  if (!Memory.externalRooms) {
    Memory.externalRooms = {}
  }

  return Object.values(nearby).filter((neighbour:string) => {
    return !Memory.externalRooms.hasOwnProperty(neighbour)
  })
}

terrain.findClaimableRooms = () => {
  const rooms = []

/*
  for (const [name, data] of Object.entries(Memory.externalRooms)) {
    if (data.controller && data.controller.owner === '') {

    }
  }

*/

  return rooms
}

terrain.is = {}

terrain.is.plain = (pos:RoomPosition) => {
  const summary = lookAtPos(pos)

  return summary.length === 1 && summary[0].terrain === 'plain'
}

terrain.is.wall = pos => {
  const summary = lookAtPos(pos)
  return summary.length === 1 && summary[0].terrain === 'wall'
}

terrain.placeFlag = (pos:RoomPosition, {name, colour, secondaryColour}) => {
  pos.createFlag(name, colour, secondaryColour)
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

terrain.findMatchingBlock = (sum, bounds, pred, roomName) => {
  const ySums = new Array(50).fill(0)

  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      // update the column's "y" sum for this row if present.
      ySums[x] = pred(new RoomPosition(x, y, roomName))
        ? ySums[x] + 1
        : 0
    }
    // -- this needs support for non-zero bounds.
    let xSum = 0
    for (let x = 0; x < ySums.length; x++) {
      // check there's a stretch of sufficiently tall columns
      xSum = ySums[x] >= sum ? xSum + 1 : 0
      if (xSum === sum) {
        return {
          x: {lower: x - sum + 1, upper: x + 1},
          y: {lower: y - sum + 1, upper: y + 1}
        }
      }
    }
  }
}

terrain.expandBounds = (bounds, roomName) => {
  const tiles = []

  for (let xPos = bounds.x.lower; xPos < bounds.x.upper; xPos++) {
    for (let yPos = bounds.y.lower; yPos < bounds.y.upper; yPos++) {
      tiles.push(new RoomPosition(xPos, yPos, roomName))
    }
  }

  return tiles
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

terrain.getBorder = (centre, dist, roomName:string) => {
  const bounds = {
    x: {
      lower: Math.max(0, centre.x - dist),
      upper: Math.min(centre.x + dist, 49)
    },
    y: {
      lower: Math.max(0, centre.y - dist),
      upper: Math.min(centre.y + dist, 49)
    }
  }

  const tiles = []

  for (const y of [bounds.y.lower, bounds.y.upper]) {
    for (let x = bounds.x.lower; x < bounds.x.upper; x++) {
      tiles.push(new RoomPosition(x, y, roomName))
    }
  }

  for (const x of [bounds.x.lower, bounds.x.upper]) {
    for (let y = bounds.y.lower; y < bounds.y.upper; y++) {
      tiles.push(new RoomPosition(x, y, roomName))
    }
  }

  return tiles
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
  const surrounding = terrain.getBorder(source.pos, 1, source.room.name)

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

terrain.findController = (roomName:string):StructureController => {
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

terrain.findClosestContainer = (pos, {notFull}) => {
  return pos.findClosestByRange(FIND_STRUCTURES, {
    filter (item) {
      const isContainer = item.structureType === STRUCTURE_CONTAINER

      if (isContainer) {
        return notFull
          ? item.store.energy < CONTAINER_CAPACITY
          : true
      }
    }
  })
}

terrain.findDamagedStructure = roomName => {
  const room = Game.rooms[roomName]

  const REASONABLE_DAMAGE = 250
  const isRepairable = new Set([STRUCTURE_EXTENSION, STRUCTURE_ROAD])
  return room.find(FIND_STRUCTURES, {
    filter (item) {
      const shouldFix = isRepairable.has(<any>item.structureType)
      const hasReasonableDamage = (item.hitsMax - item.hits) > REASONABLE_DAMAGE
      const isHalfDead = (item.hits < (7 * (item.hitsMax / 8)))

      return shouldFix && (hasReasonableDamage || isHalfDead)
    }
  })
}



terrain.exists = {}

terrain.exists.container = roomName => {
  const room = Game.rooms[roomName]

  const container = room.find(FIND_STRUCTURES, {
    filter (item) {
      return item.structureType === STRUCTURE_CONTAINER
    }
  })

  return container.length > 0
}

export default terrain
