
const constants = require('./constants')
const misc = require('./misc')
const planner = require('./planner')
const spawner = require('./spawner')
const structures = require('./structures')
const telemetry = require('./telemetry')
const terrain = require('./terrain')
const logger = require('./logger')
const tower = require('./tower')

const roles = require('./roles')

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

const runTowers = (roomName) => {
  tower.run(roomName)
}

const identifyCreeps = () => {
  for (const name of Object.keys(Game.creeps)) {
    const creep = Game.creeps[name]
    const {role, stateCode, state} = creep.memory

  }
}

const quantifyResources = roomName => {
  for (const source of terrain.findSources(roomName)) {
    const quality = terrain.getSourceQuality(source)
  }
}

const profiler = require('screeps-profiler');
profiler.enable()

const loop = () => {
  profiler.wrap(() => {

    evictCreepCache()
    applyRoles()

    for (const roomName of Object.keys(Game.rooms)) {
      const room = Game.rooms[roomName]

      misc.timer(() => {
        telemetry.logGameState(roomName)
      }, 10)

      misc.timer(() => {
        planner.run(roomName)
        structures.placePlans()
      }, 5)

      for (const spawnName of Object.keys(Game.spawns)) {
        const spawn = Game.spawns[spawnName]
        spawner.spawn(room, spawn)
      }
      runTowers(roomName)
      identifyCreeps()
    }
  })
}

module.exports.loop = loop
