
const {creepUtils} = require('./utils')

const harvester = {}

harvester.run = creep => {
  const notFull = creep.carry.energy < creep.carryCapacity

    creepUtils.transferEnergyToSpawn(creep)


  if (notFull) {
    const target = creepUtils.findSource(creep)
    creepUtils.moveToTarget(creep, target)
  } else {
    creepUtils.transferEnergyToSpawn(creep)
  }
}

module.exports = harvester
