
import constants from '../constants';
import structures from '../structures';
import terrain from '../terrain';

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

export default towers;
