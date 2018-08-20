
const {creepUtils} = require('./utils')

const builder = {}

builder.run = creep => {
  const notCharged = creep.carry.energy < creep.carryCapacity

  if (notCharged) {
    const target = creepUtils.findSource(creep)
    creepUtils.moveToTarget(creep, target)
  } else {
    creepUtils.moveToClosestSite(creep)
  }
}

module.exports = builder
