
import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import constants from '../constants'
import shared from './shared'
import {Role, Priority} from '../types'
import * as Cartography from '../modules/cartography'

const sinkPriorities = [
  {
    label: 'container',
    priorities: [STRUCTURE_STORAGE]
  }
] as Array<Priority>

const run = (creep:Creep):void => {
  Cartography.recordRoom(creep.room.name)

  if (!creep.memory.isActive) {
    shared.harvestMinerals(creep)
  } else if (creep.memory.isActive) {
    shared.chargeTarget(sinkPriorities, creep)
  }

  const carried = creeps.carrying(creep)

  if (carried === 0) {
    if (creep.ticksToLive < (constants.limits.endOfYouth / 2)) {
      shared.reclaimCreep(creep)
    } else {
      creep.memory.isActive = false
    }
  } else if (carried === creep.carryCapacity) {
    creep.memory.isActive = true
  }
}

const miner = <Role>{run}

export default miner
