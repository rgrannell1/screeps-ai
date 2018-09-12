
import constants from './constants'
import misc from './misc'
import creeps from './creeps'
import terrain from './terrain'
import blessed from './blessed'

const setQuota = {} as any
const setSpawnQuotas = room => {
  const settings = []

  Object.keys(setQuota).forEach(role => {
    settings.push({
      role,
      data: setQuota[role](room)
    })
  })

  return settings
}

setQuota.defender = () => {
  const settings = {}

  Object.assign(settings, {
    expected: 0,
    priority: constants.roles.defender.priority,
    body: constants.roles.defender.plans.standard,
    icon: constants.roles.defender.icon
  })

  return settings
}

setQuota.harvester = () => {
  const settings = {}

  Object.assign(settings, {
    expected: 2,
    priority: 0,
    body: constants.roles.harvester.plans.standard,
    icon: constants.roles.harvester.icon
  })

  return settings
}

setQuota.upgrader = () => {
  const settings = {}

  Object.assign(settings, {
    expected: 3,
    priority: 1,
    body: constants.roles.upgrader.plans.standard,
    icon: constants.roles.upgrader.icon
  })

  return settings
}

setQuota.transferer = room => {
  // -- todo. make contingent on container existing.
  const settings = {}

  const expected = terrain.exists.container(room.name)
    ? 4
    : 0

  Object.assign(settings, {
    expected: expected,
    priority: constants.roles.transferer.priority,
    body: constants.roles.transferer.plans.standard,
    icon: constants.roles.transferer.icon
  })

  return settings
}

setQuota.builder = room => {
  const settings = {}

  const SITE_TO_BUILDER_RATIO = 20
  const ENERGY_TO_BUILDER_RATIO = 2000

  const sites = room.find(FIND_CONSTRUCTION_SITES)
  const siteCount = sites.length
  const totalRequiredEnergy = sites
    .reduce((sum, site) => sum + (site.progressTotal - site.progress), 0) || 0

  const expected = Math.max(
    1,
    Math.ceil(siteCount / SITE_TO_BUILDER_RATIO),
    Math.ceil(totalRequiredEnergy / ENERGY_TO_BUILDER_RATIO))

  Object.assign(settings, {
    priority: constants.roles.builder.plans.priority,
    expected,
    body: constants.roles.builder.plans.standard,
    icon: constants.roles.builder.icon
  })

  return settings
}

setQuota.repairer = room => {
  const settings = {}

  const STRUCTURE_TO_REPAIRER_RATIO = 50
  const structureCount = room.find(FIND_STRUCTURES).length
  const expected = Math.ceil(structureCount / STRUCTURE_TO_REPAIRER_RATIO)

  Object.assign(settings, {
    expected: 0,
    priority: constants.roles.repairer.plans.priority,
    body: constants.roles.repairer.plans.standard,
    icon: constants.roles.repairer.icon
  })

  return settings
}

setQuota.scribe = room => {
  const settings = {}
  const signNotSet = room.controller.sign.text !== constants.sign

  Object.assign(settings, {
    expected: signNotSet ? 1 : 0,
    priority: 4,
    body: constants.roles.scribe.plans.standard,
    icon: constants.roles.scribe.icon
  })

  return settings
}

/*

setQuota.claimer = () => {
  const settings = {}

  Object.assign(settings, {
    expected: 0,
    priority: 4,
    icon: constants.roles.claimer.icon
  })

  return settings
}
*/

const censusCreeps = room => {
  const creeps = room.find(FIND_MY_CREEPS)
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

const createCreep = (spawn, room, data) => {
  if (!data.role) {
    throw new TypeError('cannot create creep without role')
  }
  if (!data.icon) {
    throw new TypeError('cannot create creep without icon')
  }

  const roomCapacity = room.energyAvailable
  const bodyBuilder = creeps[data.role].body(roomCapacity)

  const creepCost = creeps.getCost(bodyBuilder)
  spawn.memory.energyLock = creepCost
  spawn.memory.queued = data

  if (room.energyAvailable < creepCost) {
    return
  } else {
    delete spawn.memory.energyLock
    delete spawn.memory.data
  }

  // -- TODO add specialisations
  const spawnArgs = [
    bodyBuilder,
    data.name,
    {
      role: data.role,
      icon: data.icon,
      priority: data.priority,
      spawnRoom: spawn.room.name
    }
  ]

  const creepCode = spawn.createCreep(...spawnArgs)
  misc.match(creepCode, {
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

const displayProgress = (spawn, room, expected, actual) => {
  const counts = {
    expected: expected.find(data => data.role === spawn.memory.queued.role).data.expected,
    actual: actual[spawn.memory.queued.role],
  }

  if (Game.time % 5 === 0) {
    if (spawn.memory.energyLock) {
      blessed.log.blue(blessed.right(`[ ${room.energyAvailable} / ${spawn.memory.energyLock} towards ${spawn.memory.queued.role} (${counts.actual + 1} of ${counts.expected})]`))
    }
  }
}

const spawner = (room, spawn) => {
  const expected = setSpawnQuotas(room)
  const actual = censusCreeps(room)

  for (const {role, data} of expected.sort(sortByPriority)) {
    const expectedCount = data.expected
    const requiredCount = actual[role] || 0

    const shouldCreateCreep = expectedCount > requiredCount

    if (shouldCreateCreep) {
      createCreep(spawn, room, {...data, role, name: creeps.pickCreepName(role)})
      break
    }
  }

  displayProgress(spawn, room, expected, actual)
}

export {censusCreeps, spawner}
