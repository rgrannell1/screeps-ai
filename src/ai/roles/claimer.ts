
import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import terrain from '../terrain'
import structures from '../structures'
import shared from './shared'
import Cartography from '../modules/cartography'
import {Role, Priority} from '../types'

const run = (creep:Creep):void => {
  Cartography.recordRoom(creep.room.name)

  if (!creep.memory.initialRoom) {
     creep.memory.initialRoom = creep.room.name
  }
  if (!creep.memory.externalRoom) {
    creep.memory.externalRoom = 'W41N31'

    // const xxx = Cartography.findNeighbours(creep.room.name)
  }

  shared.claimRoom(creep)
}

const harvester = <Role>{run}

export default harvester
