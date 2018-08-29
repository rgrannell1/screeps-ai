
const plans = require('./plans')
const terrain = require('./terrain')

const planner = {}

planner.run = roomName => {
  plans.ringRoads(roomName)

  const roomLevel = Game.rooms[roomName].controller.level
  if (roomLevel >= 1) {
    plans.sourceContainers(roomName)
    plans.towers(roomName)
  }

  if (roomLevel >= 3) {
    plans.exitRoads(roomName)
  }

  if (roomLevel >= 4) {
    plans.miningRoads(roomName)
  }

  //plans.spawnExtensions(roomName)
}

module.exports = planner
