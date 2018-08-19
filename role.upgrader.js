
const {creepUtils} = require('./utils')

const upgrader = {}

upgrader.run = creep => {
  const isEmpty = creep.carry.energy < Math.floor(creep.carryCapacity / 4)

  if (isEmpty) {
    const target = creepUtils.findTarget(creep)
    creepUtils.moveToTarget(creep, target)
  } else {
    creepUtils.moveToController(creep)
  }
}

module.exports = upgrader
