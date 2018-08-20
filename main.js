
const constants = require('./constants')
const {sourceUtils, miscUtils} = require('./utils')
const roads = require('./roads')
const spawner = require('./spawner')

const roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  miner: require('role.miner'),
  builder: require('role.builder'),
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

    if (roles[role]) {
      roles[role].run(creep)
    }
  }
}

const getSettings = () => {
  const settings = {
    harvester: {
      expected: 1,
      priority: 0,
      body: constants.roles.harvester.plans.standard,
      icon: constants.roles.harvester.icon
    },
    upgrader: {
      expected: 1,
      priority: 1,
      body: constants.roles.upgrader.plans.standard,
      icon: constants.roles.upgrader.icon
    },
    builder: {
      expected: 2,
      priority: 3,
      body: constants.roles.builder.plans.standard,
      icon: constants.roles.builder.icon
    },
    repairer: {
      expected: 1,
      priority: 2,
      body: constants.roles.repairer.plans.standard,
      icon: constants.roles.repairer.icon
    }
  }

  return settings
}

const loop = () => {
  evictCreepCache()
  applyRoles()

  for (const roomName of Object.keys(Game.rooms)) {
    const room = Game.rooms[roomName]
    spawner.spawn(room, getSettings())
    roads.plan(roomName)
  }
}

module.exports.loop = loop
