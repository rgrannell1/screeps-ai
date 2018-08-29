
const constants = require('./constants')
const misc = require('./misc')
const planner = require('./planner')
const spawner = require('./spawner')
const structures = require('./structures')
const telemetry = require('./telemetry')
const terrain = require('./terrain')
const logger = require('./logger')

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

const runTowers = () => {
  // -- todo
}

const identifyCreeps = () => {
  for (const name of Object.keys(Game.creeps)) {
    const creep = Game.creeps[name]
    const {role, stateCode, state} = creep.memory

    if (state) creep.say(stateCode || state)
  }
}

const quantifyResources = roomName => {
  for (const source of terrain.findSources(roomName)) {
    const quality = terrain.getSourceQuality(source)
  }
}

telemetry.on(constants.events.tickWarning, data => {
  // -- todo
})

const profiler = require('screeps-profiler');
profiler.enable()

const loop = () => {
  profiler.wrap(() => {

    evictCreepCache()
    applyRoles()

    for (const roomName of Object.keys(Game.rooms)) {
      const room = Game.rooms[roomName]

      misc.timer(() => {
        logger.data('room state', {

        })
      }, 5)

      misc.timer(() => {
        planner.run(roomName)
        structures.placePlans()
      }, 5)

      for (const spawnName of Object.keys(Game.spawns)) {
        const spawn = Game.spawns[spawnName]
        spawner.spawn(room, spawn)
      }
    }

    identifyCreeps()
    runTowers()
  })
}

module.exports.loop = loop
