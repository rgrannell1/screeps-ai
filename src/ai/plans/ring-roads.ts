
import constants from '../constants'
import structures from '../structures'

const ringRoads = (roomName:string) => {
  const room = Game.rooms[roomName]
  const sources = room.find(FIND_SOURCES)
  const spawns = Game.spawns

  if (!room.controller) {
    return
  }

  if (structures.planExists(constants.labels.ringRoads)) {
    return
  }

  for (const name of Object.keys(spawns)) {
    const spawn = spawns[name]
    const metadata = {label: constants.labels.ringRoads}
    for (const source of sources) {
      structures.highway.place({room, source: spawn.pos, target: source.pos}, metadata)
      structures.highway.place({room, source: room.controller.pos, target: source.pos}, metadata)
      structures.highway.place({room, source: room.controller.pos, target: spawn.pos}, metadata)
    }
  }
}

export default ringRoads
