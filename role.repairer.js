
const {creepUtils} = require('./utils')

const upgrader = {}

upgrader.run = creep => {
  const notFull = creep.carry.energy < creep.carryCapacity

  if (notFull) {
    const spawn = Game.spawns['Spawn1']
    creepUtils.chargeAtSpawn(creep, spawn, 200)
  } else {
    creepUtils.repairRoads(creep)
  }
}

module.exports = upgrader
