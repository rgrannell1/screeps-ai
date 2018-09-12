
import misc from '../misc'
import middleware from './middleware'
import blessed from '../blessed'
import creeps from '../creeps'
import terrain from '../terrain'
import structures from '../structures'
import shared from './shared'
import {Role, Priority} from '../types'

const run = (creep:Creep):void => {
  if (!Memory.externalRooms) {
    Memory.externalRooms = {}
  }

  if (true) {
    terrain.findClaimableRooms()
  } else {

  }

  shared.findUnexploredRooms(creep)

}

const harvester = <Role>{run}

export default harvester
