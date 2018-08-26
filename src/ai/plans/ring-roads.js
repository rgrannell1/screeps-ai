
const roads = require('../roads')
const structures = require('../structures')

const ringRoads = roomName => {
  const room = Game.rooms[roomName]
  const sources = room.find(FIND_SOURCES)
  const spawns = Game.spawns

  for (const name of Object.keys(spawns)) {
    const spawn = spawns[name]
    const metadata = {label: 'ring-roads'}
    for (const source of sources) {
      structures.highway.place({room, source: spawn.pos, target: source.pos}, metadata)
      structures.highway.place({room, source: room.controller.pos, target: source.pos}, metadata)
      structures.highway.place({room, source: room.controller.pos, target: spawn.pos}, metadata)
    }
  }
}

module.exports = ringRoads
