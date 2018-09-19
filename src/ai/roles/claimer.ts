
import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import terrain from '../terrain'
import structures from '../structures'
import shared from './shared'
import {Role, Priority} from '../types'

const run = (creep:Creep):void => {
  if (!creep.memory.initialRoom) {
     creep.memory.initialRoom = creep.room.name
  }
  if (!creep.memory.externalRoom) {
    // -- todo
    creep.memory.externalRoom = 'W41N31'
  }

  if (true) {
    terrain.findClaimableRooms()
  } else {

  }

  shared.findUnexploredRooms(creep)
}

const harvester = <Role>{run}

export default harvester
