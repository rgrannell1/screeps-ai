
const roads = require('../roads')
const terrain = require('../terrain')

const miningRoads = roomName => {
  const room = Game.rooms[roomName]
  const minerals = terrain.findMinerals(roomName)

  const sources = terrain.findSources(roomName)
  const spawns = terrain.findSpawns(roomName)
  const controller = terrain.findController(roomName)

  const targets = sources.concat(spawns).concat([controller])

  for (const name of Object.keys(minerals)) {
    const mineral = minerals[name]

    for (const entity of targets) {
      roads.build({room, source: mineral.pos, target: entity.pos})
      roads.build({room, source: mineral.pos, target: entity.pos})
      roads.build({room, source: mineral.pos, target: entity.pos})
    }
  }
}

module.exports = miningRoads
