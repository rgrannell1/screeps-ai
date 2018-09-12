
import constants from '../constants'
import structures from '../structures'
import terrain from '../terrain'

const placeTower = roomName => {
  const controller = terrain.findController(roomName)
  const candidatePositions = terrain
    .getBorder(controller.pos, 3, roomName)
    .filter(terrain.is.plain)

  if (candidatePositions.length === 0) {
     console.log('no tower positions found')
     return
  }

  const [chosen] = candidatePositions

  if (!chosen || !chosen.x) {
    console.log(`invalid value selected from ${JSON.stringify(candidatePositions, null, 2)}`)
    return
  }

  const pos = new RoomPosition(chosen.x, chosen.y, roomName)
  structures.tower.place(pos)
}

const towers = roomName => {
  // -- check for tower counts! Otherwise lookAt will shift about

  const towerCount = structures.tower.findAll(roomName).length

  placeTower(roomName)
  placeTower(roomName)
  placeTower(roomName)
}

export default towers
