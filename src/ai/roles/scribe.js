
const constants = require('../constants')
const {creepUtils} = require('../utils')

const scribe = {}

scribe.run = (creep, xxxx) => {
  const scribeStatus = creep.signController(creep.room.controller, constants.sign)
  if (scribeStatus === ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller)
  } else if (scribeStatus === OK) {
    creep.suicide()
  }
}

module.exports = scribe
