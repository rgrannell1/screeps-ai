

import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import constants from '../constants'
import shared from './shared'
import {Role} from '../types'
import * as Cartography from '../modules/cartography'

const run = (creep:Creep):void => {
  Cartography.recordRoom(creep.room.name)

  if (!creep.memory.initialRoom) {
     creep.memory.initialRoom = creep.room.name
  }

  const priorities = [STRUCTURE_STORAGE, STRUCTURE_CONTAINER]
  const hasSource = !!structures.findEnergySource(creep.room.name, priorities)

  const neighbour:string = Cartography.findBuildeableNeighbours(creep.room.name).find(neighbour => {
    return creeps.countYoungCreeps('upgrader', neighbour) === 0
  })

  if (neighbour && creeps.countYoungCreeps('upgrader', creep.memory.initialRoom) > 0) {
    creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(neighbour)))
    return
  }

  if (!creep.memory.isActive) {
    const noHarvesters = creeps.countYoungCreeps('harvester', creep.room.name) === 0

    if (hasSource) {
      shared.chargeCreep(priorities, creep)
    } else if (noHarvesters || true) {
      shared.harvestSource(creep)
    }
  } else if (creep.memory.isActive) {
    shared.upgradeController(creep)
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

const upgrader = <Role>{run}

export default upgrader
