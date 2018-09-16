
import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import shared from './shared'
import {Role, Priority} from '../types'

const sinkPriorities = [
  {
    label: 'container',
    priorities: [STRUCTURE_CONTAINER, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE, STRUCTURE_TOWER]
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
