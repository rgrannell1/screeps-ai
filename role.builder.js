
const {creepUtils} = require('./utils')

const builder = {}

builder.run = creep => {
  const isEmpty = creep.carry.energy < creep.carryCapacity / 4
  const spawn = Game.spawns['Spawn1']

  if (isEmpty) {
    creepUtils.chargeAtSpawn(creep, spawn, 200)
  } else {
    creepUtils.moveToClosestSite(creep)
  }
}

module.exports = builder
