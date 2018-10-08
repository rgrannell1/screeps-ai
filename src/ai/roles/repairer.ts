
import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import constants from '../constants'
import terrain from '../terrain'
import {Role, Priority} from '../types'
import shared from './shared'
import * as Cartography from '../modules/cartography'

const run = (creep:Creep):void => {
  Cartography.recordRoom(creep.room.name)

  const priorities = [STRUCTURE_STORAGE, STRUCTURE_CONTAINER]

  if (!creep.memory.isActive) {
    shared.chargeCreep(priorities, creep)
  } else if (creep.memory.isActive) {
    shared.repairTarget(creep)
  }

  if (creep.carry.energy === 0) {
    if (creep.ticksToLive < (constants.limits.endOfYouth / 2)) {
      shared.reclaimCreep(creep)
    } else {
      creep.memory.isActive = false
    }
  } else if (creep.carry.energy === creep.carryCapacity) {
    creep.memory.isActive = true
  }
}

const transferer = <Role>{run}

export default transferer
