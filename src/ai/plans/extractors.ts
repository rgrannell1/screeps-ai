
import misc from '../misc'
import terrain from '../terrain'
import structures from '../structures'
import constants from '../constants'

const sourceContainers = (roomName:string) => {
  const room = Game.rooms[roomName]

  const minerals = terrain.findMinerals(roomName)
  for (const mineral of minerals) {
    const pos = new RoomPosition(mineral.pos.x, mineral.pos.y, roomName)
    structures.extractor.place(pos)
  }
}

export default sourceContainers
