
const spawner = require('./spawner')
const telemetry = require('./telemetry')
const misc = require('./misc')
const planner = require('./planner')
const structures = require('./structures')
const terrain = require('./terrain')
const constants = require('./constants')

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

    telemetry.recordCreepPosition(creep)

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

      for (const spawnName of Object.keys(Game.spawns)) {
        const spawn = Game.spawns[spawnName]
        spawner.spawn(room, spawn)
      }

      if (Game.time % 5 === 0) planner.run(roomName)
      structures.placePlans()
    }

    identifyCreeps()
    runTowers()
    telemetry.fire()

  })
}

module.exports.loop = loop
