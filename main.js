
const roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  miner: require('role.miner')
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

const getSettings = () => {
  const settings = {
    harvester: {
      expected: 3,
      body: [CARRY, WORK, MOVE, MOVE],
      icon: '⚡'
    },
    upgrader: {
      expected: 6,
      body: [CARRY, CARRY, WORK, MOVE, MOVE],
      icon: '▲'
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
}

module.exports.loop = loop
