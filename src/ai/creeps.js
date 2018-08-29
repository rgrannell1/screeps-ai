
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

module.exports = creeps
