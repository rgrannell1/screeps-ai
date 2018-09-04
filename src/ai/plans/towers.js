
const constants = require('../constants')
const structures = require('../structures')
const terrain = require('../terrain')

const placeTower = roomName => {
  const candidatePositions = terrain
    .getBorder(terrain.findController(roomName).pos, 3)
    .filter(tile => terrain.is.plain)

  const [chosen] = candidatePositions
  const pos = new RoomPosition(chosen.x, chosen.y, roomName)
  structures.tower.place(pos)
}

const towers = roomName => {
  placeTower(roomName)
  placeTower(roomName)
  placeTower(roomName)
}

module.exports = towers
