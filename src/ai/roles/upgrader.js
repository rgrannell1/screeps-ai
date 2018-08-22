
const Role = require('./role')
const misc = require('../misc')

/*
  ==================== Actions ====================
*/

const actions = {}

actions.SEEKING_SOURCE = creep => {
  delete creep.memory.controllerId

  if (!creep.memory.sourceId) {
    var source = creep.pos.findClosestByRange(FIND_SOURCES)
  }

  if (source && source.id) {
    creep.memory.sourceId = source.id
    creep.moveTo(Game.getObjectById(creep.memory.sourceId))
  }
}

actions.HARVEST = creep => {
  const harvestCode = creep.harvest(Game.getObjectById(creep.memory.sourceId))

  misc.switch(harvestCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say("Bad Tgt")
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say("Stuck!")
      creep.memory.state = 'SEEKING_SOURCE'
    },
    [ERR_NO_BODYPART]: () => {
      creep.say("No Body")
    }
  })
}

actions.SEEKING_CONTROLLER = creep => {
  delete creep.memory.sourceId
  const controllerId = creep.memory.hasOwnProperty('sourceId')
    ? creep.memory.sourceId
    : creep.room.controller.id

  creep.memory.controllerId = controllerId
  const moveCode = creep.moveTo(Game.getObjectById(controllerId))
  // -- todo arrived?
  misc.switch(moveCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say("Bad Tgt")
    },
    [ERR_NO_BODYPART]: () => {
      creep.say("No Body")
    }
  })
}

actions.UPGRADING = creep => {
  const upgradeCode = creep.upgradeController(Game.getObjectById(creep.memory.controllerId))
  misc.switch(upgradeCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say("Bad Tgt")
    },
    [ERR_NO_BODYPART]: () => {
      creep.say("No Body")
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say("Stuck!")
      creep.memory.state = 'SEEKING_CONTROLLER'
    },
    default: code => {
      console.log(code)
    }
  })
}

/*
  ==================== Senses ====================
*/

const senses = {}

senses.shouldSeekSource = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_CONTROLLER'
  } else {
    return 'SEEKING_SOURCE'
  }
}

senses.shouldSeekController = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_CONTROLLER'
  }
}

senses.atSource = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => 'HARVEST',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_SOURCE'
  })
}

senses.isDepleted = creep => {
  if (creep.carry.energy === 0) {
    return 'SEEKING_SOURCE'
  }
}

senses.atController = creep => {
  const controller = Game.getObjectById(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.upgradeController(controller), {
    [OK]: () => 'UPGRADING',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CONTROLLER'
  })
}

senses.idle = creep => {
  if (creep.memory.stateTicks > 100) {
    return 'SEEKING_SOURCE'
  }
}

/*
  ==================== States ====================
*/

const states = {
  SEEKING_SOURCE: {
    do: actions.SEEKING_SOURCE,
    until: [
      senses.shouldSeekController,
      senses.atSource
    ]
  },
  HARVEST: {
    do: actions.HARVEST,
    until: [
      senses.shouldSeekController,
      senses.atSource,
      senses.isDepleted
    ]
  },
  SEEKING_CONTROLLER: {
    do: actions.SEEKING_CONTROLLER,
    until: [
      senses.atController
    ]
  },
  UPGRADING: {
    do: actions.UPGRADING,
    until: [
      senses.isDepleted,
      senses.idle
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_SOURCE'
})
