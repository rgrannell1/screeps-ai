
/*
const sign = constants.sign
const signCode = creep.signController(Game.getObjectById(creep.memory.controllerId), sign)





  creep.say('Bye!')
  creep.suicide()

*/


import misc from '../misc'
import middleware from './middleware'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'

const run = creep => {
  if (creep.carry.energy < creep.carryCapacity) {
    chargeCreep(creep)
  } else if (creep.carry.energy === creep.carryCapacity) {
    chargeTarget(creep)
  }
}

export default {run}
