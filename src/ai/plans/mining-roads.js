
const terrain = require('../terrain')
const constants = require('../constants')
const structures = require('../structures')

const miningRoads = roomName => {
  const room = Game.rooms[roomName]

  if (structures.planExists(constants.labels.miningRoads)) {
    return
  }

  const minerals = terrain.findMinerals(roomName)

  const sources = terrain.findSources(roomName)
  const spawns = terrain.findSpawns(roomName)
  const controller = terrain.findController(roomName)

  const targets = sources.concat(spawns).concat([controller])
  const metadata = {label: constants.labels.miningRoads}

  for (const name of Object.keys(minerals)) {
    const mineral = minerals[name]

    for (const entity of targets) {
      structures.highway.place({room, source: mineral.pos, target: entity.pos}, metadata)
      structures.highway.place({room, source: mineral.pos, target: entity.pos}, metadata)
      structures.highway.place({room, source: mineral.pos, target: entity.pos}, metadata)
    }
  }
}

module.exports = miningRoads
