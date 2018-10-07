
import interactive from './interactive'
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
import market from './market/index'
import * as Architecture from '../modules/architecture'
import * as profiler from 'screeps-profiler'

import Cartography from './modules/cartography'

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

profiler.enable()

declare global {
  interface CreepMemory {
    [key:string]: any
  }
}

const state = {
  run: false,
  resultAcc: []
}

const onStart = () => {
  logger.data('code_updated', 'code_updated', {})
  state.run = true
}

const loop = () => {
  evictCreepCache()
  applyRoles()

  if (!state.run) {
    onStart()
  }

  for (const roomName of Object.keys(Game.rooms)) {
    const room = Game.rooms[roomName]

    const burp = Cartography.findBuildeableNeighbours(roomName)
    console.log(JSON.stringify(burp))
    console.log('++++++++++++++++++')

    misc.timer(() => {
      telemetry.logGameState(roomName)
    }, 50

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
}

const wrapped = profiler.wrap.bind(null, loop)

export {loop}
