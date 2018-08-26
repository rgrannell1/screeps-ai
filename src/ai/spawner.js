
const constants = require('./constants')
const misc = require('./misc')
const terrain = require('./terrain')

const setSpawnQuotas = room => {
  const settings = []

  Object.keys(setSpawnQuotas).forEach(role => {
    settings.push({
      role,
      data: setSpawnQuotas[role](room)
    })
  })

  return settings
}

setSpawnQuotas.harvester = () => {
  const settings = {}

  Object.assign(settings, {
    expected: 3,
    priority: 0,
    body: constants.roles.harvester.plans.standard,
    icon: constants.roles.harvester.icon
  })

  return settings
}

setSpawnQuotas.upgrader = () => {
  const settings = {}

  Object.assign(settings, {
    expected: 5,
    priority: 1,
    body: constants.roles.upgrader.plans.standard,
    icon: constants.roles.upgrader.icon
  })

  return settings
}

setSpawnQuotas.transferer = room => {
  // -- todo. make contingent on container existing.
  const settings = {}

  const expected = terrain.exists.container(room.name)
    ? 2
    : 0

  Object.assign(settings, {
    expected: 2,
    priority: expected,
    body: constants.roles.transferer.plans.standard,
    icon: constants.roles.transferer.icon
  })

  return settings
}

setSpawnQuotas.builder = room => {
  const settings = {}

  const SITE_TO_BUILDER_RATIO = 2
  const ENERGY_TO_BUILDER_RATIO = 1000

  const sites = room.find(FIND_CONSTRUCTION_SITES)
  const siteCount = sites.length
  const totalRequiredEnergy = sites
    .reduce((sum, site) => sum + (site.progressTotal - site.progress), 0) || 0

  const expected = Math.max(
    1,
    Math.ceil(siteCount / SITE_TO_BUILDER_RATIO),
    Math.ceil(totalRequiredEnergy / ENERGY_TO_BUILDER_RATIO))

  Object.assign(settings, {
    priority: 3,
    expected,
    body: constants.roles.builder.plans.standard,
    icon: constants.roles.builder.icon
  })

  return settings
}

setSpawnQuotas.repairer = room => {
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

setSpawnQuotas.scribe = room => {
  const settings = {}
  const signNotSet = room.controller.sign.text !== constants.sign

  Object.assign(settings, {
    expected: signNotSet ? 1 : 0,
    priority: 2,
    body: constants.roles.scribe.plans.standard,
    icon: constants.roles.scribe.icon
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

const createCreep = (spawn, data) => {
  if (!data.role) {
    throw new TypeError('cannot create creep without role')
  }
  if (!data.icon) {
    throw new TypeError('cannot create creep without icon')
  }

  const creepCost = misc.getCreepCost(data.body)
  spawn.memory.energyLock = creepCost
  spawn.memory.queued = data

  if (spawn.energy < creepCost) {
    return
  } else {
    delete spawn.memory.energyLock
    delete spawn.memory.data
  }

  const spawnArgs = [
    data.body,
    data.name,
    {
      role: data.role,
      icon: data.icon,
      priority: data.priority
    }
  ]

  const creepCode = spawn.createCreep(...spawnArgs)
  misc.switch(creepCode, {
    [OK] () {
      console.log(`creating ${data.role}`)
    },
    [ERR_NOT_OWNER] () {
      console.log(`spawn not owned`)
    },
    [ERR_NAME_EXISTS] () {
      console.log(`name ${data.name} already exists`)
    },
    [ERR_BUSY] () {

    },
    [ERR_NOT_ENOUGH_ENERGY] () {

    },
    [ERR_INVALID_ARGS] () {
      console.log(`invalid body ${JSON.stringify(spawnArgs, null, 2)}`)
    },
    [ERR_RCL_NOT_ENOUGH] () {
      console.log('invalid controller level')
    },
    default (code) {
      console.log(`unhandled spawn code ${code}`)
    }
  })
}

const sortByPriority = (roleData0, roleData1) => {
  return roleData0.data.priority - roleData1.data.priority
}

const spawner = (room, spawn) => {
  const expected = setSpawnQuotas(room)
  const actual = censusCreeps(room)

  spawner.displayProgress(spawn)

  for (const {role, data} of expected.sort(sortByPriority)) {
    const expectedCount = data.expected
    const requiredCount = actual[role] || 0

    const shouldCreateCreep = expectedCount > requiredCount

    if (shouldCreateCreep) {
      createCreep(spawn, {...data, role, name: misc.pickCreepName(role)})
      break
    }
  }
}

spawner.displayProgress = spawn => {
  if (Game.time % 5 === 0) {
    if (spawn.memory.energyLock) {
      console.log(`[ ${spawn.energy} / ${spawn.memory.energyLock} towards ${spawn.memory.queued.role} ]`)
    }
  }
}

module.exports = {
  spawn: spawner
}
