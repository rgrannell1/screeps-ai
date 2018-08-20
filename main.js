
const constants = require('./constants')
const {sourceUtils, miscUtils} = require('./utils')

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

const tickRoles = () => {
  for (const name of Object.keys(Game.creeps)) {
    const creep = Game.creeps[name]
    const {role} = creep.memory

    if (roles[role]) {
      roles[role].run(creep)
    }
  }
}

const censusCreeps = spawn => {
  const creeps = spawn.room.find(FIND_CREEPS)
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

const populateWorld = settings => {
  for (const spawnName of Object.keys(Game.spawns)) {
    const spawn = Game.spawns[spawnName]
    const counts = censusCreeps(spawn)

    for (const role of Object.keys(settings)) {
      const {expected, body, icon} = settings[role]
      const moreNeeded = !counts.hasOwnProperty(role) || counts[role] < expected

      if (moreNeeded) {
        const status = spawn.createCreep(body, undefined, {role, icon})
        if (status !== OK && status !== ERR_NOT_ENOUGH_ENERGY && status !== ERR_BUSY) {
          console.log(status)
        }
      }
    }

  }
}

const planStructures = roomName => {
  planStructures.roads(roomName)
}

planStructures.roads = roomName => {
  const room = Game.rooms[roomName]
  const sources = room.find(FIND_SOURCES)
  const spawns = Game.spawns

  if (Memory.roadsBuild === true) {
    return
  }

  for (const name of Object.keys(spawns)) {
    const spawn = spawns[name]

    for (const source of sources) {
      miscUtils.buildRoad({
        room,
        source: spawn.pos,
        target: source.pos,
        roomName
      })

      miscUtils.buildRoad({
        room,
        source: room.controller.pos,
        target: source.pos,
        roomName
      })
    }
  }

  Memory.roadsBuild = true
}

const getSettings = () => {
  const settings = {
    harvester: {
      expected: 3,
      body: constants.roles.harvester.plans.standard,
      icon: constants.roles.harvester.icon
    },
    upgrader: {
      expected: 3,
      body: constants.roles.upgrader.plans.standard,
      icon: constants.roles.upgrader.icon
    },
    builder: {
      expected: 1,
      body: constants.roles.builder.plans.standard,
      icon: constants.roles.builder.icon
    },
    /*
    miner: {
      expected: 0,
      body: [CARRY, WORK, MOVE, MOVE],
      icon: '⚒'
    }
    */
  }

  return settings
}

const loop = () => {
  evictCreepCache()

  tickRoles()
  populateWorld(getSettings())
  planStructures('W16N33')
}

module.exports.loop = loop
