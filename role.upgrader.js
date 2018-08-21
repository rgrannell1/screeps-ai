
const {creepUtils} = require('./utils')

const upgrader = {}

upgrader.run = creep => {
  const notFull = creep.carry.energy < creep.carryCapacity

  const hasEssentialCreeps = creepUtils.creepExists('harvester')

  if (notFull && hasEssentialCreeps) {
    const spawn = Game.spawns['Spawn1']
    creepUtils.chargeAtSpawn(creep, spawn, 100)
  } else {
    creepUtils.moveToController(creep)
  }
}

module.exports = upgrader
