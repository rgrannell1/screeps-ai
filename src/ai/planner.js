
const plans = require('./plans')
const terrain = require('./terrain')

const planner = {}

planner.run = roomName => {
  plans.ringRoads(roomName)

  const level = Game.rooms[roomName].controller.level
  if (level >= 1) {
    plans.sourceContainers(roomName)
    plans.extensions(roomName)
  }

  if (level >= 3) {
    plans.exitRoads(roomName)
  }

  if (level >= 4) {
    plans.miningRoads(roomName)
  }
}

module.exports = planner
