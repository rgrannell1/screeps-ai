
const constants = require('./constants')
const {sourceUtils} = require('./utils')
const roads = require('./roads')
const spawner = require('./spawner')
const telemetry = require('./telemetry')
const misc = require('./misc')

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

const identifyCreeps = () => {
  for (const name of Object.keys(Game.creeps)) {
    const creep = Game.creeps[name]
    const {role, state} = creep.memory

    misc.switch(`${Game.time % 10}`, {
      0: () => creep.say(role),
      1: () => {
        if (state) creep.say(state)
      },
    })
  }
}

const loop = () => {
  evictCreepCache()
  applyRoles()

  for (const roomName of Object.keys(Game.rooms)) {
    const room = Game.rooms[roomName]

    for (const spawnName of Object.keys(Game.spawns)) {
      const spawn = Game.spawns[spawnName]
      spawner.spawn(room, spawn)
    }
    roads.plan(roomName)
  }

  identifyCreeps()
}

module.exports.loop = loop
