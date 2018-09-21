
import misc from '../misc'
import terrain from '../terrain'
import structures from '../structures'

const sourceContainers = (roomName:string) => {
  const sources = terrain.findSources(roomName)
  for (const source of sources) {

    if (Memory.sources && Memory.sources[source.id]) {
      const containerCount = terrain.findContainers(roomName).length
      if (containerCount === sources.length) {
        return
      }
    }

    const candidatePositions = terrain
      .getBorder(source.pos, 1, roomName)
      .filter(tile => terrain.is.plain)

    const [chosen] = candidatePositions
    const pos = new RoomPosition(chosen.x, chosen.y, roomName)
    structures.container.place(pos)
  }
}

export default sourceContainers
