
const misc = require('../../misc')
const terrain = require('../../terrain')
const constants = require('../../constants')

const actions = {}

actions.BUILDING = creep => {
  const site = Game.getObjectById(creep.memory.siteId)
  if (!site) {
    console.log(`site missing (id ${creep.memory.siteId})`)
    creep.say('Stuck!')
    delete creep.memory.siteId
    creep.memory.state = 'SEEKING_SITE'
  }

  const buildCode = creep.build(site)
  misc.switch(buildCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_SITE'
    },
    default: code => {
      console.log(code)
    }
  })
}

actions.CHARGE = creep => {
  const chargeCode = creep.harvest(Game.getObjectById(creep.memory.sourceId))

  misc.switch(chargeCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_CHARGE'
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

actions.CHARGE_SPAWN = creep => {
  const upgradeCode = creep.transfer(Game.getObjectById(creep.memory.spawnId), RESOURCE_ENERGY)
  misc.switch(upgradeCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_SPAWN'
    },
    default: code => {
      console.log(code)
    }
  })
}

actions.CHARGE_CONTAINER = creep => {
  const chargeCode = creep.transfer(Game.getObjectById(creep.memory.containerId), RESOURCE_ENERGY)
  misc.switch(chargeCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_SPAWN'
    },
    default: code => {
      console.log(code)
    }
  })
}

actions.HARVEST = creep => {
  const harvestCode = creep.harvest(Game.getObjectById(creep.memory.sourceId))

  misc.switch(harvestCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_SOURCE'
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

actions.DRAIN_CONTAINER = creep => {
  const drainCode = creep.withdraw(Game.getObjectById(containerId), RESOURCE_ENERGY)

  misc.switch(drainCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_CONTAINER'
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

actions.SEEKING_CHARGE = creep => {
  delete creep.memory.siteId
  delete creep.memory.siteId

  if (!creep.memory.sourceId) {
    var source = creep.pos.findClosestByRange(FIND_SOURCES)
  }

  if (source && source.id) {
    creep.memory.sourceId = source.id
    creep.moveTo(Game.getObjectById(creep.memory.sourceId))
  }
}

actions.SEEKING_CHARGE = creep => {
  if (creep.memory.sourceId) {
    console.log('moving to sourceid')
    creep.moveTo(Game.getObjectById(creep.memory.sourceId))
  }
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
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

actions.SEEKING_SITE = creep => {
  delete creep.memory.sourceId

  let siteId = creep.memory.hasOwnProperty('siteId')
    ? creep.memory.siteId
    : null
  if (!siteId) {
    const [site] = creep.room.find(FIND_CONSTRUCTION_SITES)
    siteId = site.id
  }

  creep.memory.siteId = siteId
  const site = Game.getObjectById(siteId)
  const moveCode = creep.moveTo(site)

  misc.switch(moveCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Move')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

actions.SEEKING_SOURCE = creep => {
  delete creep.memory.spawnId

  if (!creep.memory.sourceId) {
    var source = creep.pos.findClosestByRange(FIND_SOURCES)
  }

  if (source && source.id) {
    creep.memory.sourceId = source.id
    creep.moveTo(Game.getObjectById(creep.memory.sourceId))
  }
}

actions.SEEKING_SPAWN = creep => {
  const spawn = Game.spawns['Spawn1']

  delete creep.memory.sourceId
  const spawnId = creep.memory.hasOwnProperty('spawnId')
    ? creep.memory.spawnId
    : spawn.id

  creep.memory.spawnId = spawnId
  const moveCode = creep.moveTo(Game.getObjectById(spawnId))
  misc.switch(moveCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

actions.SEEKING_CONTAINER = creep => {
  let containerId = creep.memory.hasOwnProperty('containerId')
    ? creep.memory.containerId
    : null

  if (!containerId) {
    const container = terrain.findClosestContainer(creep.pos)

    if (!container) {
      console.log('no containers found!')
      return
    } else {
      containerId = container.id
    }
  }

  creep.memory.containerId = containerId
  const moveCode = creep.moveTo(Game.getObjectById(containerId))

  misc.switch(moveCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

actions.UPGRADING = creep => {
  const upgradeCode = creep.upgradeController(Game.getObjectById(creep.memory.controllerId))
  misc.switch(upgradeCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_CONTROLLER'
    },
    default: code => {
      console.log(code)
    }
  })
}

actions.SIGNING = creep => {
  const sign = constants.sign
  const signCode = creep.signController(Game.getObjectById(creep.memory.controllerId), sign)
  misc.switch(signCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_CONTROLLER'
    },
    default: code => {
      console.log(code)
    }
  })
}

actions.DYING = creep => {
  creep.say('Bye!')
  creep.suicide()
}

actions.SEEKING_DAMAGE = creep => {
  delete creep.memory.spawnId
  let damageId = creep.memory.hasOwnProperty('damageId')
    ? creep.memory.damageId
    : null

  if (!damageId) {
    const isRepairable = new Set([STRUCTURE_EXTENSION, STRUCTURE_ROAD])
    const [damaged] = terrain.findDamagedStructure(creep.room.name)

    damageId = damaged.id
  }

  creep.memory.damageId = damageId
  const moveCode = creep.moveTo(Game.getObjectById(damageId))
  misc.switch(moveCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })

}

actions.REPAIR = creep => {
  const repairId = creep.repair(Game.getObjectById(creep.memory.damageId))
  misc.switch(repairId, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_DAMAGE'
    },
    default: code => {
      console.log(code)
    }
  })
}

module.exports = actions