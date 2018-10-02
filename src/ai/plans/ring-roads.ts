
import misc from '../misc'
import terrain from '../terrain'
import structures from '../structures'
import templates from '../templates'
import constants from '../constants'
import interactive from '../interactive'
import Architecture from '../modules/architecture'
import Geometry from '../modules/geometry'
import Compute from '../modules/compute'
import {Bounds} from '../types'

const placeRoad = (roomName:string, source:RoomPosition, target:RoomPosition) => {
  const roadPath = Game.rooms[roomName].findPath(source, target, {
    ignoreCreeps: true,
    ignoreRoads: false
  })

  for (const {x, y} of roadPath) {
    const pos = new RoomPosition(x, y, roomName)
    if (!terrain.is.wall(pos)) {
      //Architecture.addPlan(pos, {...metadata, structure: STRUCTURE_ROAD})
    }
  }
}

const ringRoads = (roomName:string) => {
  const room = Game.rooms[roomName]
  const sources = room.find(FIND_SOURCES)

  if (!room.controller) {
    return
  }

  return
  if (Architecture.hasPlan(roomName, constants.labels.ringRoads)) {
    return
  }


  for (const [name, spawn] of Object.entries(Game.spawns)) {
    const metadata = {label: constants.labels.ringRoads}
    for (const source of sources) {
      placeRoad(roomName, source.pos, source.pos)
    }
  }

  /*
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
  */
}

export default ringRoads
