
const constants = require('./constants')
const creeps = {}

creeps.exists = (roleName, roomName, count = 1) => {
  const room = Game.rooms[roomName]

  return room.find(FIND_CREEPS).filter(creep => {
    creep.memory.roleName === roleName
  }).length >= count
}

creeps.pickCreepName = role => {
  if (!Memory.roles) {
    Memory.roles = {}
  }

  if (Memory.roles.hasOwnProperty(role) && Memory.roles[role].hasOwnProperty('count')) {
    Memory.roles[role].count++
  } else {
    Memory.roles[role] = {count: 0}
  }

  return `${constants.roles[role].icon}-${Memory.roles[role].count}`
}

creeps.getCost = parts => {
  return parts.reduce((sum, part) => sum + constants.costs[part], 0)
}

creeps.findTargetEnemy = creepName => {
  const creep = Game.creeps[creepName]
  const nearbyHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
    filter (creep) {
      return !constants.whitelist.includes(creep.owner.username.toLowerCase())
    }
  })

  return nearbyHostile
}

const flerp = (initial, extension, capacity) => {
  const currentCost = creeps.getCost(initial)

  let parts = initial
  while (true) {
    let proposed = extension

    if (creeps.getCost(parts.concat(proposed)) < capacity) {
      parts = parts.concat(proposed)
    } else {
      break
    }
  }

  return parts
}

creeps.roles = {}

creeps.harvester = {}

creeps.harvester.body = capacity => {
  return flerp([CARRY, CARRY, WORK, MOVE], [WORK, CARRY, MOVE], capacity)
}

creeps.upgrader = {}

creeps.upgrader.body = capacity => {
  return flerp([CARRY, CARRY, WORK, MOVE, MOVE], [WORK, CARRY, MOVE], capacity)
}

creeps.defender = {}

creeps.defender.body = capacity => {
  return [ATTACK, ATTACK, MOVE, MOVE, TOUGH, TOUGH]
}

creeps.transferer = {}

creeps.transferer.body = capacity => {
  return flerp([CARRY, CARRY, WORK, MOVE, MOVE], [CARRY, CARRY, MOVE], capacity)
}

creeps.builder = {}

creeps.builder.body = capacity => {
  return flerp([CARRY, CARRY, WORK, MOVE, MOVE], [CARRY, CARRY, MOVE], capacity)
}

creeps.repairer = {}

creeps.repairer.body = capacity => {
  return flerp([CARRY, CARRY, WORK, MOVE, MOVE], [CARRY, CARRY, MOVE], capacity)
}

creeps.scribe = {}

creeps.scribe.body = capacity => {
  return [WORK, MOVE, MOVE]
}

module.exports = creeps
