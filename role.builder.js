
const constants = require('./constants')
const {creepUtils} = require('./utils')

const builder = {}

builder.run = creep => {
  const isEmpty = creep.carry.energy < creep.carryCapacity / 4
  const spawn = Game.spawns['Spawn1']

  const hasEssentialCreeps = creepUtils.creepExists('harvester') && creepUtils.creepExists('upgrader')

  if (isEmpty && hasEssentialCreeps) {
    creepUtils.chargeAtSpawn(creep, spawn, 250)
  } else {
    creepUtils.moveToClosestSite(creep)
  }
}

module.exports = builder
