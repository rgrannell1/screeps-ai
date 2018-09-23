
import plans from './plans/index'
import terrain from './terrain'

const planner = {} as any

planner.run = (roomName:string):void => {
  plans.ringRoads(roomName)

  const roomLevel = Game.rooms[roomName].controller.level

  if (roomLevel >= 1) {
    plans.sourceContainers(roomName)
    plans.towers(roomName)
  }

  if (roomLevel >= 3) {
    plans.exitRoads(roomName)
  }

  if (roomLevel >= 6) {
    plans.extractors(roomName)
    plans.miningRoads(roomName)
  }
}

export default planner
