
const misc = require('../misc')
const terrain = require('../terrain')
const structures = require('../structures')

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
      .filter(tile => terrain.is.plain)

    const [chosen] = candidatePositions
    const pos = new RoomPosition(chosen.x, chosen.y, roomName)
    structures.container.place(pos)
  }
}

module.exports = sourceContainers
