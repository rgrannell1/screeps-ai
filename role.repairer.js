
const {creepUtils} = require('./utils')
const roads = require('./roads')

const upgrader = {}

upgrader.run = creep => {
  const notFull = creep.carry.energy < creep.carryCapacity

  const hasEssentialCreeps = creepUtils.creepExists('harvester') && creepUtils.creepExists('upgrader')

  if (notFull && hasEssentialCreeps) {
    const spawn = Game.spawns['Spawn1']
    creepUtils.chargeAtSpawn(creep, spawn, 200)
  } else {
    roads.repair(creep)
  }
}

module.exports = upgrader
