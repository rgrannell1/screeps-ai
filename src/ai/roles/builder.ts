
import misc from '../misc'
import middleware from './middleware'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import shared from './shared'
import {Role} from '../types'

const run = (creep:Creep):void => {
  if (creep.carry.energy === 0) {
    shared.chargeCreep([STRUCTURE_STORAGE, STRUCTURE_CONTAINER, STRUCTURE_SPAWN], creep)
  } else if (creep.carry.energy === creep.carryCapacity) {
    shared.buildSite(creep)
  }
}

const builder = <Role>{run}

export default builder
