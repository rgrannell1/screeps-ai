
const spawner = require('./spawner')
const telemetry = require('./telemetry')
const misc = require('./misc')
const planner = require('./planner')
const structures = require('./structures')
const terrain = require('./terrain')

const roles = {
  harvester: require('./roles/harvester'),
  upgrader: require('./roles/upgrader'),
  builder: require('./roles/builder'),
  repairer: require('./roles/repairer'),
  scribe: require('./roles/scribe'),
  transferer: require('./roles/transferer')
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
    const {role, stateCode, state} = creep.memory

    misc.switch(`${Game.time % 10}`, {
      0: () => {
        if (state) creep.say(stateCode || state)
      },
      1: () => {
        creep.say(creep.name)
      }
    })
  }
}

const quantifyResources = roomName => {
  for (const source of terrain.findSources(roomName)) {
    const quality = terrain.getSourceQuality(source)
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
    structures.placePlans()
  }

  identifyCreeps()
}

module.exports.loop = loop
