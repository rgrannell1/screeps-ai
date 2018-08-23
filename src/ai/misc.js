
const constants = require('./constants')
const misc = {}

misc.pickCreepName = () => {
  let name = ''
  for (let ith = 0; ith < 4; ++ith) {
    name += constants.koremutake[Math.floor(Math.random() * constants.koremutake.length)]
  }

  return name
}

misc.getCreepCost = parts => {
  return parts.reduce((sum, part) => sum + constants.costs[part], 0)
}

misc.switch = (value, opts) => {
  if (opts.hasOwnProperty(value)) {
    return opts[value](value)
  }
  if (opts.default) {
    return opts.default(value)
  }
}

misc.nearbyTiles = (pos, {dist, roomName}) => {
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

misc.nearbyEmptyTiles = (pos, {dist, roomName}) => {
  const room = Game.rooms[roomName]

  return misc.nearbyTiles(pos, {dist, roomName}).filter(tile => {
    const occupiers = room.lookAt(tile)
    return !occupiers.some(entry => {
      return entry.terrain === 'wall'
    })
  })
}

module.exports = misc
