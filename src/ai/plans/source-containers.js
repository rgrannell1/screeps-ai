
const roads = require('../roads')
const misc = require('../misc')
const terrain = require('../terrain')

const sourceContainers = roomName => {
  for (const source of terrain.findSources(roomName)) {

    if (Memory.sources && Memory.sources[source.id]) {
      // --validate present.
      return
    }

    const candidatePositions = terrain
      .getBorder(source.pos, 2)
        .filter(tile => terrain.isPlain)

    const [chosen] = candidatePositions
    const pos = new RoomPosition(chosen.x, chosen.y, roomName)
    const createCode = pos.createConstructionSite(STRUCTURE_CONTAINER)

    const created = misc.switch(createCode, {
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
        console.log(`create source error ${val}`)
      }
    })
  }

}

module.exports = sourceContainers
