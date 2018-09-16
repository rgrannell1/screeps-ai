
import constants from './constants'
import misc from './misc'
import planner from './planner'
import spawns from './spawns/index'
import structures from './structures'
import telemetry from './telemetry'
import terrain from './terrain'
import logger from './logger'
import tower from './tower'
import roles from './roles/index'
import * as profiler from 'screeps-profiler'

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

const runTowers = (roomName:string) => {
  tower.run(roomName)
}

const identifyCreeps = () => {
  for (const name of Object.keys(Game.creeps)) {
    const creep = Game.creeps[name]
    const {role, stateCode, state} = creep.memory
  }
}

const quantifyResources = (roomName:string) => {
  for (const source of terrain.findSources(roomName)) {
    const quality = terrain.getSourceQuality(source)
  }
}

profiler.enable()

declare global {
  interface CreepMemory {
    [key:string]: any
  }
}

const loop = () => {
  profiler.wrap(() => {

    evictCreepCache()
    applyRoles()

    for (const roomName of Object.keys(Game.rooms)) {
      const room = Game.rooms[roomName]

      telemetry.logGameState(roomName)

      misc.timer(() => {
        planner.run(roomName)
        structures.placePlans(roomName)
      }, 5)

      for (const spawnName of Object.keys(Game.spawns)) {
        spawns.spawner(roomName, Game.spawns[spawnName])
      }

      runTowers(roomName)
      identifyCreeps()
    }
  })
}

export { loop }
