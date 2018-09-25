
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
import interative from './interactive'
import Geometry from './modules/geometry'
import Compute from './modules/compute'
import * as profiler from 'screeps-profiler'

global.interactive = interactive

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

function takeIterValues (store, batch:number) {
  for (let ith = 0; ith < batch; ith++) {
    let yielded = state.result.next()

    if (yielded.done) {
      return true
    } else {
      store.push(yielded.value)
    }
  }

  // -- make a noop after a few runs

  return false
}
let ITH=0

const loop = () => {
  profiler.wrap(() => {
    evictCreepCache()
    applyRoles()

    if (!state.run) {
      onStart()
    }

    for (const roomName of Object.keys(Game.rooms)) {
      const room = Game.rooms[roomName]

      if (roomNme === 'W42N31') {
        if (!state.result) {
          state.result = Geometry.yieldEmptyBlocks(roomName, {
            x: 3,
            y: 3
          })
        }

        if (takeIterValues(state.resultAcc, 400)) {
          ITH++
          let result = state.resultAcc[ITH]

          if (result) {
            interactive.drawPositions(roomName, Geometry.expandBounds(roomName, result))
          }
        }
      }

      //interactive.drawPlans('W42N31')

      misc.timer(() => {
        telemetry.logGameState(roomName)
      }, 10)

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
