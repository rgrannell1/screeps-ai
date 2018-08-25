
const roads = require('../roads')

const ringRoads = roomName => {
  const room = Game.rooms[roomName]
  const sources = room.find(FIND_SOURCES)
  const spawns = Game.spawns

  for (const name of Object.keys(spawns)) {
    const spawn = spawns[name]

    for (const source of sources) {
      roads.build({room, source: spawn.pos, target: source.pos})
      roads.build({room, source: room.controller.pos, target: source.pos})
      roads.build({room, source: room.controller.pos, target: spawn.pos})
    }
  }
}

module.exports = ringRoads
