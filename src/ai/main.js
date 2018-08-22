
const constants = require('./constants')
const {sourceUtils} = require('./utils')
const roads = require('./roads')
const spawner = require('./spawner')
const telemetry = require('./telemetry')
const misc = require('./misc')
const planner = require('./plans/planner')

const roles = {
  harvester: require('./roles/harvester'),
  upgrader: require('./roles/upgrader'),
  miner: require('./roles/miner'),
  builder: require('./roles/builder'),
  repairer: require('./roles/repairer')
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
      3: () => {
        creep.say(creep.name)
      }
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
    planner.run(roomName)
  }

  identifyCreeps()
}

module.exports.loop = loop
