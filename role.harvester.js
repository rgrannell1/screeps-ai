
const {creepUtils} = require('./utils')

const harvester = {}

harvester.run = creep => {
  const notFull = creep.carry.energy < creep.carryCapacity

  if (notFull) {
    const target = creepUtils.findSource(creep)
    creepUtils.moveToTarget(creep, target)
  } else {
    creepUtils.moveToSpawn(creep)
  }
}

module.exports = harvester
