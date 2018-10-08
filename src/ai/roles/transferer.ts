
import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import constants from '../constants'
import terrain from '../terrain'
import {Role, Priority} from '../types'
import shared from './shared'
import * as Cartography from '../modules/cartography'

const sinkPriorities = [
  {
    label: 'extensions',
    priorities: [STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_STORAGE]
  },
  {
    label: 'spawns',
    priorities: [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE]
  },
  {
    label: 'towers',
    priorities: [STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE]
  },
  {
    label: 'storage',
    priorities: [STRUCTURE_STORAGE, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN]
  }
] as Array<Priority>

const run = (creep:Creep):void => {
  Cartography.recordRoom(creep.room.name)

  if (!creep.memory.isActive) {
    shared.chargeCreep([STRUCTURE_CONTAINER], creep)
  } else if (creep.memory.isActive) {
    shared.chargeTarget(sinkPriorities, creep)
  }

  if (creep.carry.energy === 0) {
    if (creep.ticksToLive < (constants.limits.endOfYouth / 2)) {
      shared.reclaimCreep(creep)
    } else {
      // kill if dead and near spawn
      creep.memory.isActive = false
    }
  } else {
    creep.memory.isActive = true
  }
}

const transferer = <Role>{run}

export default transferer
