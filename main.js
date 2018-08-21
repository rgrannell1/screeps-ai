
const constants = require('./constants')
const {sourceUtils} = require('./utils')
const roads = require('./roads')
const spawner = require('./spawner')
const telemetry = require('./telemetry')

const roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  miner: require('role.miner'),
  builder: require('role.builder'),
  repairer: require('role.repairer')
}

const evictCreepCache = () => {
  for (const name in Memory.creeps) {
    if (!Game.creeps.hasOwnProperty(name)) {
      delete Memory.creeps[name]
    }
  }
}

const applyRoles = () => {
  for (const name of Object.keys(Game.creeps)) {
    const creep = Game.creeps[name]
    const {role} = creep.memory

    telemetry.recordCreepPosition(creep)

    if (roles[role]) {
      roles[role].run(creep)
    }
  }
}

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

const loop = () => {
  evictCreepCache()
  applyRoles()

  for (const roomName of Object.keys(Game.rooms)) {
    const room = Game.rooms[roomName]
    spawner.spawn(room, getSettings(room))
    roads.plan(roomName)
  }
}

module.exports.loop = loop
