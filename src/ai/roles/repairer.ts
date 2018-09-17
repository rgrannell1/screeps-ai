
import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import terrain from '../terrain'
import {Role, Priority} from '../types'
import shared from './shared'

const run = (creep:Creep):void => {
  const priorities = [STRUCTURE_STORAGE, STRUCTURE_CONTAINER]

  if (!creep.memory.isActive) {
    shared.chargeCreep(priorities, creep)
  } else if (creep.memory.isActive) {
    shared.repairTarget(creep)
  }

  if (creep.carry.energy === 0) {
    creep.memory.isActive = false
  } else if (creep.carry.energy === creep.carryCapacity) {
    creep.memory.isActive = true
  }
}

const transferer = <Role>{run}

export default transferer
