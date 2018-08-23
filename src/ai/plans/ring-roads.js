
const roads = require('../roads')
const misc = require('../misc')

const ringRoads = roomName => {
  const room = Game.rooms[roomName]
  const sources = room.find(FIND_SOURCES)
  const spawns = Game.spawns

  for (const name of Object.keys(spawns)) {
    const spawn = spawns[name]

    for (const source of sources) {
      const sharedOpts = {
        room,
        roomName
      }

      roads.build({...sharedOpts, source: spawn.pos, target: source.pos})
      roads.build({...sharedOpts, source: room.controller.pos, target: source.pos})
      roads.build({...sharedOpts, source: room.controller.pos, target: spawn.pos})
    }
  }
}

module.exports = ringRoads