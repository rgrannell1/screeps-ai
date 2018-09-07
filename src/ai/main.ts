
import constants from './constants.ts'
import misc from './misc.ts'
import planner from './planner.ts'
import {spawner} from './spawner.ts'
import structures from './structures.ts'
import telemetry from './telemetry.ts'
import terrain from './terrain.ts'
import logger from './logger.ts'
import tower from './tower.ts'
import roles from './roles'
import profiler from 'screeps-profiler'

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
        spawner(room, spawn)
      }
      runTowers(roomName)
      identifyCreeps()
    }
  })
}

export { loop }
