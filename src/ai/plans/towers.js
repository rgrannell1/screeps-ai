
const constants = require('../constants')
const structures = require('../structures')
const terrain = require('../terrain')

const towers = roomName => {
  const candidatePositions = terrain
    .getBorder(terrain.findController(roomName).pos, 3)
    .filter(tile => terrain.is.plain)

  const [chosen] = candidatePositions
  const pos = new RoomPosition(chosen.x, chosen.y, roomName)
  structures.tower.place(pos)
}

module.exports = towers
