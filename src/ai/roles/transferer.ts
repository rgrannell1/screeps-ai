
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
  if (!creep.memory.isActive) {
    shared.chargeCreep([STRUCTURE_CONTAINER, ], creep)
  } else if (creep.memory.isActive) {
    shared.chargeTarget(sinkPriorities, creep)
  }

  if (creep.carry.energy === 0) {
    creep.memory.isActive = false
  } else if (creep.carry.energy === creep.carryCapacity) {
    creep.memory.isActive = true
  }
}

const transferer = <Role>{run}

export default transferer

/*

  const priorities = [STRUCTURE_STORAGE, STRUCTURE_CONTAINER]
  const hasSource = !!structures.findEnergySource(creep.room.name, priorities)

  if (!creep.memory.isActive) {
    if (hasSource) {
      shared.chargeCreep(priorities, creep)
    } else {
      shared.harvestSource(creep)
    }
  } else if (creep.memory.isActive) {
    shared.upgradeController(creep)
  }

  if (creep.carry.energy === 0) {
    creep.memory.isActive = false
  } else if (creep.carry.energy === creep.carryCapacity) {
    creep.memory.isActive = true
  }

*/