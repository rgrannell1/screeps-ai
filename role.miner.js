
const {creepUtils} = require('./utils')

const miner = {}

miner.run = creep => {
  const notFull = creep.carry.energy < creep.carryCapacity

  if (notFull) {
  const target = creepUtils.findMinerals(creep)
    creepUtils.moveToTarget(creep, target)
  } else {
    creepUtils.moveToSpawn(creep)
  }
}

module.exports = miner
