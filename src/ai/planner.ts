
import plans from './plans/index'
import terrain from './terrain'
import * as Architecture from './modules/architecture'

const planner = {} as any

planner.run = (roomName:string):void => {
  plans.ringRoads(roomName)

  const room = Game.rooms[roomName]

  if (room && room.controller) {
    const roomLevel = room.controller.level

    if (roomLevel >= 1) {
      plans.sourceContainers(roomName)
      plans.towers(roomName)
    }

    if (roomLevel >= 3) {
      plans.exitRoads(roomName)
      plans.spawnExtensions(roomName)
    }

    if (roomLevel >= 6) {
      plans.extractors(roomName)
      plans.miningRoads(roomName)
    }
  }
}

export default planner
