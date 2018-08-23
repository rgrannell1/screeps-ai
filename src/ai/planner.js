
const plans = require('./plans')
const terrain = require('./terrain')

const planner = {}

planner.run = roomName => {
  plans.ringRoads(roomName)

  const level = Game.rooms[roomName].controller.level

  if (level > 1) {
    plans.sourceContainers(roomName)
    plans.extensions(roomName)
  }
}

module.exports = planner
