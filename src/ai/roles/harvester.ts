
import misc from '../misc'
import middleware from './middleware'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import shared from './shared'
import {Role, Priority} from '../types'

const sinkPriorities = [
  {
    label: 'spawns',
    priorities: [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE]
  },
  {
    label: 'storage',
    priorities: [STRUCTURE_STORAGE, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN]
  },
  {
    label: 'extensions',
    priorities: [STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_STORAGE]
  },
  {
    label: 'towers',
    priorities: [STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE]
  }
] as Array<Priority>

const run = (creep:Creep):void => {
  if (!creep.memory.isActive) {
    shared.harvestSource(creep)
  } else if (creep.memory.isActive) {
    shared.chargeTarget(sinkPriorities, creep)
  }

  if (creep.carry.energy === 0) {
    creep.memory.isActive = false
  } else if (creep.carry.energy === creep.carryCapacity) {
    creep.memory.isActive = true
  }
}

const harvester = <Role>{run}

export default harvester
