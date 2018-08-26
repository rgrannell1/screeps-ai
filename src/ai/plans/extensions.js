
const roads = require('../roads')
const misc = require('../misc')
const terrain = require('../terrain')

const extensions = roomName => {
  const room = Game.rooms[roomName]
  const sourceRoads = terrain.findRoads(roomName)

  for (const road of sourceRoads) {
    const block = terrain.getBlock(road.pos, 1)
  }


  return

  const sources = terrain.findSources(roomName)
  const spawns = terrain.findSpawns(roomName)


  const distantRoads = sourceRoads.filter(road => {
    const isDistant = {
      sources: sourceRoads.filter(road => {
        return sources.every(source => {
          return source.pos.findPathTo(road.pos).length <= 3
        })
      }),
      spawns: sourceRoads.filter(road => {
        return spawns.every(spawn => {
          return spawn.pos.findPathTo(road.pos).length <= 3
        })
      })
    }

    //return isDistant.sources & isDistant.spawns
  })

}

module.exports = extensions
