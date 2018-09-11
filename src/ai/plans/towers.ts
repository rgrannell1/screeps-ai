
import constants from '../constants'
import structures from '../structures'
import terrain from '../terrain'

const placeTower = roomName => {

  const controller = terrain.findController(roomName)
  const candidatePositions = terrain
    .getBorder(controller.pos, 4, roomName)
    .filter(terrain.is.plain)

  const [chosen] = candidatePositions
   if (!chosen) {
     console.log('no tower positions found')
     return
   }

  const pos = new RoomPosition(chosen.x, chosen.y, roomName)
  structures.tower.place(pos)
}

const towers = roomName => {
  placeTower(roomName)
  placeTower(roomName)
  placeTower(roomName)
}

export default towers
