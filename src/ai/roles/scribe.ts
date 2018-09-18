
import misc from '../misc'
import blessed from '../blessed'
import creeps from '../creeps'
import terrain from '../terrain'
import constants from '../constants'
import shared from './shared'
import {Role} from '../types'

const run = (creep:Creep):void => {
  const controller = terrain.findController(creep.room.name)
  const isSigned = controller && controller.sign && controller.sign.text === constants.sign
  if (isSigned) {
    shared.killCreep(creep)
  } else {
    shared.signController(creep, controller, constants.sign)
  }
}

const scribe = <Role>{run}
export default scribe
