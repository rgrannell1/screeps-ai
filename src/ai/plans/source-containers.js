
const misc = require('../misc')
const terrain = require('../terrain')

const sourceContainers = roomName => {
  const sources = terrain.findSources(roomName)
  for (const source of sources) {

    if (Memory.sources && Memory.sources[source.id]) {
      const containerCount = terrain.findContainers(roomName).length
      if (containerCount === sources.length) {
        return
      }
    }

    const candidatePositions = terrain
      .getBorder(source.pos, 2)
      .filter(tile => terrain.isPlain)

    const [chosen] = candidatePositions
    const pos = new RoomPosition(chosen.x, chosen.y, roomName)
    const createCode = pos.createConstructionSite(STRUCTURE_CONTAINER)

    misc.switch(createCode, {
      [OK] () {
        if (!Memory.sources) {
          Memory.sources = {}
        }
        Memory.sources[source.id] = {
          x: pos.x,
          y: pos.y,
          id: source.id
        }
      },
      default (val) {
        console.log(`create container error ${val}`)
      }
    })
  }
}

module.exports = sourceContainers
