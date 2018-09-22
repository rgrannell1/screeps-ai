
import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'
import shared from './shared'
import {Role, Priority} from '../types'
import Cartography from '../modules/cartography'

const run = (creep:Creep):void => {
  Cartography.recordRoom(creep.room.name)

  if (!creep.memory.initialRoom) {
     creep.memory.initialRoom = creep.room.name
  }
  if (!creep.memory.externalRoom) {
    // -- todo find some alternative room
    creep.memory.externalRoom = 'W41N31'
  }

  // -- todo find
}

const harvester = <Role>{run}

export default harvester
