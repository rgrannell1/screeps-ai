
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

const applyRoles = () => {
  for (const name of Object.keys(Game.creeps)) {
    const creep = Game.creeps[name]
    const {role} = creep.memory

    if (roles[role]) {
      roles[role].run(creep)
    }
  }
}

const censusCreeps = room => {
  const creeps = room.find(FIND_CREEPS)
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

const spawnCreeps = (room, settings) => {
  const counts = censusCreeps(room)

  for (const spawnName of Object.keys(Game.spawns)) {
    const spawn = Game.spawns[spawnName]

    for (const role of Object.keys(settings)) {
      const {expected, body, icon} = settings[role]
      const moreNeeded = !counts.hasOwnProperty(role) || counts[role] < expected

      if (moreNeeded) {
        const creepName = miscUtils.pickCreepName(icon)
        const status = spawn.createCreep(body, creepName, {role, icon})
        if (status !== OK && status !== ERR_NOT_ENOUGH_ENERGY && status !== ERR_BUSY) {
          console.log(status)
        }
      }
    }
  }
}

const planRoads = roomName => {
  const room = Game.rooms[roomName]
  const sources = room.find(FIND_SOURCES)
  const spawns = Game.spawns

  if (Memory.roadsBuild === true) {
    return
  }

  for (const name of Object.keys(spawns)) {
    const spawn = spawns[name]

    for (const source of sources) {
      const shared = {
        room,
        roomName,
        target: source.pos
      }
      miscUtils.buildRoad(Object.assign({}, shared, {
        source: spawn.pos
      }))

      miscUtils.buildRoad(Object.assign({}, shared, {
        source: room.controller.pos
      }))
    }
  }

  Memory.roadsBuild = true
}

const getSettings = () => {
  const settings = {
    harvester: {
      expected: 1,
      body: constants.roles.harvester.plans.standard,
      icon: constants.roles.harvester.icon
    },
    upgrader: {
      expected: 1,
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
  applyRoles()

  for (const roomName of Object.keys(Game.rooms)) {
    const room = Game.rooms[roomName]
    spawnCreeps(room, getSettings())
    planRoads(roomName)
  }
}

module.exports.loop = loop
