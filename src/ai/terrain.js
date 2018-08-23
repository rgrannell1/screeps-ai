
const terrain = {}

terrain.getRing = (centre, roomName) => {
  const room = Game.rooms[roomName]

  const tiles = []

  for (const x of [pos.x - dist, pos.x + dist]) {
    if (x < 0) continue
    for (const y of [pos.y - dist, pos.y + dist]) {
      if (y < 0) continue

      tiles.push(new RoomPosition(x, y, roomName))
    }
  }

  return tiles  
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

module.exports = terrain
