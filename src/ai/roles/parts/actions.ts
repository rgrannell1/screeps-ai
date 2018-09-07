
import misc from '../../misc'
import terrain from '../../terrain'
import structures from '../../structures'
import constants from '../../constants'
import blessed from '../../blessed'
import creeps from '../../creeps'

const actions = {} as any

actions.BUILDING = creep => {
  creep.memory.state = 'SEEKING_SITE'

  const site = Game.getObjectById(creep.memory.siteId)
  if (!site) {
    delete creep.memory.siteId
    creep.memory.state = 'SEEKING_SITE'
  }

  const buildCode = creep.build(site)
  misc.match(buildCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad build')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    },
    [ERR_NOT_IN_RANGE]: () => {

    },
    default: code => {
      console.log(code)
    }
  })
}

actions.CHARGE = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  if (!source) {
    console.log('no source found for .CHARGE')
  }

  const chargeCode = creep.harvest(source)

  misc.match(chargeCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad chg')
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
  misc.match(upgradeCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad spwn')
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

actions.CHARGE_EXTENSION = creep => {
  const upgradeCode = creep.transfer(Game.getObjectById(creep.memory.extensionId), RESOURCE_ENERGY)
  misc.match(upgradeCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad spwn')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    },
    [ERR_NOT_IN_RANGE]: () => {
      creep.say('Stuck!')
      creep.memory.state = 'SEEKING_EXTENSION'
    },
    default: code => {
      console.log(code)
    }
  })
}

actions.CHARGE_CONTAINER = creep => {
  const container = Game.getObjectById(creep.memory.containerId)

  if (!container) {
    creep.memory.state = 'SEEKING_CONTAINER'
  }

  if (container.store.energy === CONTAINER_CAPACITY) {
    console.log('container full! Need to fill altenative energy sink!')
    return
  }

  const chargeCode = creep.transfer(container, RESOURCE_ENERGY)
  misc.match(chargeCode, {
    [OK]: () => {},
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad cnt')
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

  misc.match(harvestCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad src')
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
  const drainCode = creep.withdraw(Game.getObjectById(creep.memory.containerId), RESOURCE_ENERGY)

  misc.match(drainCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad cnt')
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

actions.SEEKING_ENEMY = creep => {
  let enemyId = creep.memory.enemyId

  if (!enemyId || !Game.getObjectById(enemyId)) {
    delete creep.memory.enemyId
    const enemy = creeps.findTargetEnemy(creep.name)

    if (enemy) {
      creep.memory.enemyId = enemy.id
    }
  }

  const enemy = Game.getObjectById(creep.memory.enemyId)
  if (!enemy) {
    return
  }
  const moveCode = creep.moveTo(enemy)

  misc.match(moveCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad enemy')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

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

actions.SEEKING_CHARGE = creep => {
  if (creep.memory.sourceId) {
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
  misc.match(moveCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad crtl')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

/*
  SEEKING_SITE

  Assign a prioritised site to a builder. Start with key structures.
*/
actions.SEEKING_SITE = creep => {
  delete creep.memory.sourceId
  let siteId = creep.memory.siteId

  if (!siteId || !Game.getObjectById(siteId)) {
    delete creep.memory.siteId
    const site = structures.findSite(creep.room.name, [
      STRUCTURE_CONTAINER,
      STRUCTURE_EXTENSION,
      STRUCTURE_TOWER,
      STRUCTURE_STORAGE,
      STRUCTURE_ROAD,
      STRUCTURE_RAMPART
    ])

    creep.memory.siteId = site ? site.id : null
    return
  }

  const site = Game.getObjectById(siteId)
  creep.memory.siteId = site.id
  const moveCode = creep.moveTo(site)

  misc.match(moveCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad site')
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
  misc.match(moveCode, {
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad spwn')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    }
  })
}

actions.SEEKING_CONTAINER = creep => {
  let containerId = creep.memory.containerId
  if (!containerId) {
    const [container] = structures.container.findAll(creep.room.name)

    if (!container) {
      console.log(`Container not found by ${blessed.red(creep.memory.role)}!`)
      return
    } else {
      containerId = container.id
    }
  }

  creep.memory.containerId = containerId
  const moveCode = creep.moveTo(Game.getObjectById(containerId))

  misc.match(moveCode, {
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
  misc.match(upgradeCode, {
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
  misc.match(signCode, {
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

  const site = Game.getObjectById(damageId)

  if (!site || structures.is.damaged(site)) {
    damageId = null
  }

  if (!damageId) {
    const [damaged] = terrain.findDamagedStructure(creep.room.name)
    damageId = damaged.id
  }

  creep.memory.damageId = damageId
  const moveCode = creep.moveTo(Game.getObjectById(damageId))
  misc.match(moveCode, {
    [OK]: () => {

    },
    [ERR_INVALID_TARGET]: () => {
      creep.say('Bad Tgt')
    },
    [ERR_NO_BODYPART]: () => {
      creep.say('No Body')
    },
    default (val) {
      blessed.log.red(`seek-damage-status ${val}`)
    }
  })

}

actions.REPAIR = creep => {
  const site = Game.getObjectById(creep.memory.damageId)

  if (site.hits === site.hitsMax) {
    // -- bodge
    creep.memory.state = 'SEEKING_DAMAGE'
    console.log(blessed.log.red(`${site.id} has no damage. forcibly deleting`))
    delete creep.memory.damageId
  } else {
    const siteCode = creep.repair(site)

    misc.match(siteCode, {
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
}

export default actions
