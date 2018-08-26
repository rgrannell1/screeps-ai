
const plans = require('./plans')
const terrain = require('./terrain')

const planner = {}

planner.run = roomName => {
  plans.ringRoads(roomName)

  const roomLevel = Game.rooms[roomName].controller.level
  if (roomLevel >= 1) {
    plans.sourceContainers(roomName)
    plans.extensions(roomName)
  }

  if (roomLevel >= 3) {
    plans.exitRoads(roomName)
  }

  if (roomLevel >= 4) {
    plans.miningRoads(roomName)
  }

  if (Game.time % 20) {
    plans.frequentRoads(roomName)
  }
}

module.exports = planner
