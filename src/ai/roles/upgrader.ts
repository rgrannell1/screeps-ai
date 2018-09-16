

import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import shared from './shared'
import {Role} from '../types'

const run = (creep:Creep):void => {
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
}

const upgrader = <Role>{run}

export default upgrader
