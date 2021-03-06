
import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import shared from './shared'
import {Role, Priority} from '../types'
import * as Cartography from '../modules/cartography'

const sinkPriorities = [
  {
    label: 'extensions',
    priorities: [STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_STORAGE]
  },
  {
    label: 'container',
    priorities: [STRUCTURE_CONTAINER, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE, STRUCTURE_TOWER]
  }
] as Array<Priority>

const run = (creep:Creep):void => {
  Cartography.recordRoom(creep.room.name)

  if (!creep.memory.initialRoom) {
     creep.memory.initialRoom = creep.room.name
  }
  if (!creep.memory.externalRoom) {
    creep.memory.externalRoom = creep.room.name
  }

  if (!creep.memory.isActive) {
    shared.harvestSource(creep)
  } else if (creep.memory.isActive) {
    shared.chargeLocalTarget(sinkPriorities, creep)
  }

  if (creep.carry.energy === 0) {
    creep.memory.isActive = false
  } else if (creep.carry.energy === creep.carryCapacity) {
    creep.memory.isActive = true
  }
}

const harvester = <Role>{run}

export default harvester
