
import misc from '../misc'
import middleware from './middleware'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import terrain from '../terrain'
import {Role, Priority} from '../types'
import shared from './shared'

const sinkPriorities = [
  {
    label: 'spawns',
    priorities: [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE]
  },
  {
    label: 'towers',
    priorities: [STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE]
  },
  {
    label: 'extensions',
    priorities: [STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_STORAGE]
  },
  {
    label: 'storage',
    priorities: [STRUCTURE_STORAGE, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN]
  }
] as Array<Priority>

const run = (creep:Creep):void => {
  if (creep.carry.energy < creep.carryCapacity) {
    shared.chargeCreep([STRUCTURE_CONTAINER, STRUCTURE_STORAGE], creep)
  } else if (creep.carry.energy === creep.carryCapacity) {
    shared.chargeTarget(sinkPriorities, creep)
  }
}

const transferer = <Role>{run}

export default transferer
