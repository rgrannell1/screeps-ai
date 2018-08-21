
const constants = require('./constants')
const misc = require('./misc')
const {sourceUtils} = require('./utils')

const getSettings = room => {
  const settings = {}

  Object.keys(getSettings).forEach(role => {
    settings[role] = getSettings[role](room)
  })

  return settings
}

getSettings.harvester = () => {
  const settings = {}

  Object.assign(settings, {
    expected: 5,
    priority: 0,
    body: constants.roles.harvester.plans.standard,
    icon: constants.roles.harvester.icon
  })

  return settings
}
getSettings.upgrader = () => {
  const settings = {}

  Object.assign(settings, {
    expected: 5,
    priority: 1,
    body: constants.roles.upgrader.plans.standard,
    icon: constants.roles.upgrader.icon
  })

  return settings
}

getSettings.builder = room => {
  const settings = {}

  const SITE_TO_BUILDER_RATIO = 5
  const siteCount = room.find(FIND_CONSTRUCTION_SITES).length
  const expected = Math.ceil(siteCount / SITE_TO_BUILDER_RATIO)

  Object.assign(settings, {
    priority: 3,
    expected,
    body: constants.roles.builder.plans.standard,
    icon: constants.roles.builder.icon
  })

  return settings
}

getSettings.repairer = room => {
  const settings = {}

  const STRUCTURE_TO_REPAIRER_RATIO = 50
  const structureCount = room.find(FIND_STRUCTURES).length
  const expected = Math.ceil(structureCount / STRUCTURE_TO_REPAIRER_RATIO)

  Object.assign(settings, {
    expected: expected,
    priority: 2,
    body: constants.roles.repairer.plans.standard,
    icon: constants.roles.repairer.icon
  })

  return settings
}

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

const isPrioritisedCreep = (priority, settings, census) => {
  const requiredRoles = Object.keys(settings).filter(role => {
    return settings[role].priority < priority
  })

  const allPresent = requiredRoles.every(role => {
    return census[role] === settings[role].expected
  })

  return allPresent
}

const spawn = room => {
  const settings = getSettings(room)

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

      if (moreNeeded && isPrioritisedCreep(priority, settings, counts)) {
        const creepName = misc.pickCreepName(icon)
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
