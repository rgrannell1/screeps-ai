
const Role = require('role')
const misc = require('./misc')

/*
  ==================== Actions ====================
*/

const actions = {}

actions.SEEKING_CHARGE = creep => {
  delete creep.memory.siteId

  if (!creep.memory.sourceId) {
    var source = creep.pos.findClosestByRange(FIND_SOURCES)
  }

  if (source && source.id) {
    creep.memory.sourceId = source.id
    creep.moveTo(Game.getObjectById(creep.memory.sourceId))
  }
}

actions.CHARGE = creep => {
  const chargeCode = creep.charge(Game.getObjectById(creep.memory.sourceId))

  misc.switch(chargeCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say("Bad Tgt")
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say("Stuck!")
      creep.memory.state = 'SEEKING_CHARGE'
    },
    [ERR_NO_BODYPART]: () => {
      creep.say("No Body")
    }
  })
}

actions.SEEKING_SITE = creep => {
  delete creep.memory.sideId
  const controllerId = creep.memory.hasOwnProperty('sideId')
    ? creep.memory.sideId
    : 'xxxxxxxxxxxxxxxxxxxxxxx'

  creep.memory.siteId = siteId
  const moveCode = creep.moveTo(Game.getObjectById(siteId))
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

actions.BUILDING = creep => {
  const buildCode = creep.upgradeController(Game.getObjectById(creep.memory.siteId))
  misc.switch(buildCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say("Bad Tgt")
    },
    [ERR_NO_BODYPART]: () => {
      creep.say("No Body")
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say("Stuck!")
      creep.memory.state = 'SEEKING_SITE'
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
    return 'SEEKING_SITE'
  } else {
    return 'SEEKING_CHARGE'
  }
}

senses.shouldSeekController = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SITE'
  }
}

senses.atSource = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.CHARGE(source), {
    [OK]: () => 'CHARGE',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CHARGE'
  })
}

senses.isDepleted = creep => {
  if (creep.carry.energy === 0) {
    return 'SEEKING_CHARGE'
  }
}

senses.atSite = creep => {
  const controller = Game.getObjectById(creep.memory.siteId)
  creep.moveTo(controller)

  return misc.switch(creep.build(site), {
    [OK]: () => 'BUILDING',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_SITE'
  })
}

senses.atCharge = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => 'SEEKING_SITE',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_SOURCE'
  })
}

senses.shouldSeekCharge = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SITE'
  } else {
    return 'SEEKING_CHARGE'
  }
}

senses.idle = creep => {
  if (creep.memory.stateTicks > 100) {
    return 'SEEKING_CHARGE'
  }
}

/*
  ==================== States ====================
*/

const states = {
  SEEKING_CHARGE: {
    do: actions.SEEKING_CHARGE,
    until: [
      senses.shouldSeekCharge,
      senses.atCharge
    ]
  },
  CHARGE: {
    do: actions.CHARGE,
    until: [
      senses.shouldSeekSite,
      senses.isDepleted
    ]
  },
  SEEKING_SITE: {
    do: actions.SEEKING_SITE,
    until: [
      senses.atSite
    ]
  },
  BUILDING: {
    do: actions.BUILDING,
    until: [
      senses.isDepleted
    ]
  }
}

module.exports = Role(states, {
  initalState: 'SEEKING_CHARGE'
})
