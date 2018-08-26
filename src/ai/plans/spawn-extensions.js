

const constants = require('../constants')
const structures = require('../structures')
const terrain = require('../terrain')

const parts = {
  extension: {structure: STRUCTURE_EXTENSION},
  road: {structure: STRUCTURE_ROAD}
}

const rows = {
  mixed: new Array(3).fill(parts.extension)
    .concat([parts.road])
    .concat(new Array(3).fill(parts.extension)),
  road: new Array(7).fill(parts.road)
}

const flerp = () => {
  return new Array(3).fill(rows.mixed)
    .concat([rows.road])
    .concat(new Array(3).fill(rows.mixed))
}

const recursivelyFindBlock = (pred, roomName, bounds) => {
  if (bounds.x.upper + 1 === 50 || bounds.y.upper + 1 === 50) {
    return bounds
  }

  let allBlank = {
    x: true,
    y: true
  }

  for (let x = bounds.x.lower; x <= bounds.x.upper + 1; ++x) {
    let pos = new RoomPosition(x, y.bound.upper, roomName)
    if (!pred(pos)) {
      allBlank.x = false
      break
    }
  }

  for (let y = bounds.y.lower; y <= bounds.y.upper + 1; ++y) {
    let pos = new RoomPosition(x.bound.upper, y, roomName)
    if (!pred(pos)) {
      allBlank.y = false
      break
    }
  }

  if (allBlank.x && allBlank.y) {
    return {
      offset: bounds.offset + 1,
      x: {lower: bounds.x, upper},
      y: {lower: bounds.y, upper: tile.y},
      roomName
    }
  } else {
    bounds
  }
}

const spawnExtensions = roomName => {
  for (const tile of terrain.getMap(roomName)) {
    if (!terrain.is.plain({...tile, roomName})) {
      continue
    }
    const bounds = {
      offset: 0,
      x: {lower: tile.x, upper: tile.x},
      y: {lower: tile.y, upper: tile.y}
    }
    const recurred = recursivelyFindBlock(terrain.is.plain, roomName, bounds)
  }
}

module.exports = spawnExtensions
