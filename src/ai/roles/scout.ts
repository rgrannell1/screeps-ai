
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
    const nearby = Cartography.findUnchartedNeighbours(creep.room.name)
    creep.memory.externalRoom = nearby
  }

  if (creep.room.name !== creep.memory.externalRoom) {
    creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.externalRoom)))
    return
  } else {
    creep.say('Just a Scout!')
    creep.suicide()
  }
}

const harvester = <Role>{run}

export default harvester
