
const constants = require('./constants')
const {sourceUtils, miscUtils} = require('./utils')

const censusCreeps = room => {
  const creeps = room.find(FIND_CREEPS)
  const table = {}

  for (const name of Object.keys(creeps)) {
    const creep = creeps[name]
    const {role} = creep.memory

    if (table.hasOwnProperty(role)) {
      table[role]++
    } else {
      table[role] = 1
    }
  }

  return table
}

const shouldCreateCreep = (priority, settings, census) => {
  const requiredRoles = Object.keys(settings).filter(role => {
    return settings[role].priority < priority
  })

  const allPresent = requiredRoles.every(role => {
    return !!census[role]
  })

  return allPresent
}

const spawn = (room, settings) => {
  const counts = censusCreeps(room)
  const sortedRoles = Object.keys(settings).sort((name0, name1) => {
    return settings[name0].priority - settings[name1].priority
  })

  const spawns = Object.keys(Game.spawns).sort()

  for (const spawnName of spawns) {
    const spawn = Game.spawns[spawnName]

    for (const role of sortedRoles) {
      const {expected, priority, body, icon} = settings[role]
      const moreNeeded = !counts.hasOwnProperty(role) || counts[role] < expected

      if (moreNeeded && shouldCreateCreep(priority, settings, counts)) {
        const creepName = miscUtils.pickCreepName(icon)
        const status = spawn.createCreep(body, creepName, {role, icon, priority})
        if (status !== OK && status !== ERR_NOT_ENOUGH_ENERGY && status !== ERR_BUSY) {
          console.log(status)
        }
      }
    }
  }
}

module.exports = {
  spawn
}
