
const misc = require('../../misc')
const terrain = require('../../terrain')
const constants = require('../../constants')
const senses = {}

const states = {
  BUILDING: 'BUILDING',
  SEEKING_SITE: 'SEEKING_SITE',
  CHARGE: 'CHARGE',
  SEEKING_CHARGE: 'SEEKING_CHARGE',
  CHARGE_CONTAINER: 'CHARGE_CONTAINER',
  SEEKING_CONTAINER: 'SEEKING_CONTAINER',
  CHARGE_SPAWN: 'CHARGE_SPAWN',
  SEEKING_SPAWN: 'SEEKING_SPAWN',
  DYING: 'DYING',
  HARVEST: 'HARVEST',
  SEEKING_SOURCE: 'SEEKING_SOURCE',
  REPAIR: 'REPAIR',
  SEEKING_CONTROLLER: 'SEEKING_CONTROLLER',
  SEEKING_DAMAGE: 'SEEKING_DAMAGE',
  SIGNING: 'SIGNING',
  UPGRADING: 'UPGRADING',
}

const StateChange = (run, states) => {
  return {run, states}
}

const Transition = (state, reason) => {
  return {state, reason}
}

const getObj = Game.getObjectById

senses.atDamage = StateChange(creep => {
  const site = getObj(creep.memory.damageId)

  creep.moveTo(site)
  return misc.switch(creep.repair(site), {
    [OK]: () => Transition(states.REPAIR, 'repair succeeeded'),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_CHARGE, 'not in range')
  })
}, [states.REPAIR, states.SEEKING_CHARGE])

senses.repairComplete = StateChange(creep => {
  const site = getObj(creep.memory.damageId)

  return misc.switch(-100, {
    [OK]: () => Transition(states.SEEKING_CHARGE),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_CHARGE)
  })

}, [states.SEEKING_CHARGE])

senses.atCharge = StateChange(creep => {
  const loaded = getObj(creep.memory.sourceId)
  const source = loaded
    ? loaded
    : terrain.findClosestSource(creep.pos)

  creep.memory.sourceId = source.id

  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => Transition(states.CHARGE, 'harvest successful'),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_CHARGE, 'not in range')
  })
}, [states.CHARGE, states.SEEKING_CHARGE])

senses.atController = StateChange(creep => {
  const controller = getObj(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.upgradeController(controller), {
    [OK]: () => Transition(states.UPGRADING),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_CONTROLLER, 'not in range'),
    [ERR_NO_BODYPART]: () => {

    }
  })
}, [states.UPGRADING, states.SEEKING_CONTROLLER])

senses.atContainerFromSpawn = StateChange(creep => {
  const container = getObj(creep.memory.containerId)

  if (!container || container.store.energy < CONTAINER_CAPACITY) {
    return Transition(states.SEEKING_CONTAINER, 'no container or not full')
  }

  creep.moveTo(container)

  return misc.switch(creep.withdraw(container, RESOURCE_ENERGY), {
    [OK]: () => Transition(states.DRAIN_CONTAINER, 'withdrew energy'),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_CONTAINER, 'not in range'),
    [ERR_FULL]: () => Transition(states.DRAIN_CONTAINER, 'already full'),
    default (val) {
      console.log(`at container code ${val} (${creep.memory.role})`)
    }
  })
}, [states.SEEKING_CONTAINER, states.DRAIN_CONTAINER])

senses.containerSeekerNeedsSpawn = StateChange(creep => {
  if (!creep.memory.containerId) {

  }

  const container = getObj(creep.memory.containerId)

  if (!container || container.store.energy === 0) {
    return Transition(states.SEEKING_SPAWN, 'No container or container empty')
  }

  creep.moveTo(container)

  return misc.switch(creep.transfer(container, RESOURCE_ENERGY), {
    [OK]: () => Transition(states.CHARGE_CONTAINER, 'transfer successfully'),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_CONTAINER, 'not in range'),
    [ERR_FULL]: () => Transition(states.CHARGE_CONTAINER, 'already full'),
    default (val) {
      console.log(`at container code ${val} (${creep.memory.role})`)
    }
  })
}, [states.SEEKING_SPAWN, states.CHARGE_CONTAINER, states.SEEKING_CONTAINER])

senses.atContainer = StateChange(creep => {
  const container = getObj(creep.memory.containerId)

  if (!container) {
    return Transition(states.SEEKING_SOURCE)
  }

  creep.moveTo(container)

  return misc.switch(creep.transfer(container, RESOURCE_ENERGY), {
    [OK]: () => Transition(states.CHARGE_CONTAINER, 'transfered successfully'),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_CONTAINER, 'not in range'),
    [ERR_FULL]: () => Transition(states.CHARGE_CONTAINER, 'already full'),
    default (val) {
      console.log(`at container code ${val} (${creep.memory.role})`)
    }
  })
}, [states.SEEKING_SOURCE, states.CHARGE_CONTAINER, states.SEEKING_CONTAINER])

senses.canSignController = StateChange(creep => {
  const controller = getObj(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.signController(controller, constants.sign), {
    [OK]: () => Transition(states.SIGNING, 'signed successfully'),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_CONTROLLER, 'not in range'),
    [ERR_NO_BODYPART]: () => {

    },
    default (val) {
      console.log(`sign-code ${val}`)
    }
  })
}, [states.SIGNING, states.SEEKING_CONTROLLER])

senses.atSite = StateChange(creep => {
  if (!creep.memory.siteId || !getObj(creep.memory.siteId)) {
    console.log('site missing')
    delete creep.memory.siteId
    return
  }

  const site = getObj(creep.memory.siteId)
  creep.moveTo(site)

  return misc.switch(creep.build(site), {
    [OK]: () => {
      return Transition(states.BUILDING, 'built successfully')
    },
    [ERR_INVALID_TARGET]: () => {
      return Transition(states.BUILDING, 'bad target')
    },
    [ERR_NOT_IN_RANGE]: () => {
      return Transition(states.SEEKING_SITE, 'not in range')
    },
    [ERR_NOT_ENOUGH_RESOURCES]: () => {
      return Transition(states.SEEKING_CHARGE, 'needs charge')
    },
    default (val) {
      console.log(`seek site code ${val}`)
    }
  })
}, [states.BUILDING, states.SEEKING_SITE, states.SEEKING_CHARGE])

senses.atSource = StateChange(creep => {
  const source = getObj(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => Transition(states.CHARGE, 'harvested successfully'),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_CHARGE, 'not in range')
  })
}, [states.CHARGE, states.SEEKING_CHARGE])

senses.atSpawn = StateChange(creep => {
  const spawn = getObj(creep.memory.spawnId)
  creep.moveTo(spawn)

  return misc.switch(creep.transfer(spawn, RESOURCE_ENERGY), {
    [OK]: () => Transition(states.CHARGE_SPAWN, 'transfered successfully'),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_SPAWN, 'not in range'),
    [ERR_FULL] () {
      // -- TODO
    },
    [ERR_NOT_ENOUGH_RESOURCES]: () => 'aaaaaaaaaaa',
    default (code) {
      creep.say(`charge ${code}`)
    }
  })
}, [states.CHARGE_SPAWN, states.SEEKING_SPAWN])

senses.atSpawnFromContainer = StateChange(creep => {
  const spawn = getObj(creep.memory.spawnId)
  creep.moveTo(spawn)

  return misc.switch(creep.transfer(spawn, RESOURCE_ENERGY), {
    [OK]: () => Transition(states.CHARGE_SPAWN, 'transfered successfully'),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_SPAWN, 'not in range'),
    [ERR_FULL] () {
      // -- TODO
    },
    [ERR_NOT_ENOUGH_RESOURCES]: () => Transition(states.SEEKING_CONTAINER, 'not enough resources'),
    default (code) {
      creep.say(`charge ${code}`)
    }
  })
}, [states.CHARGE_SPAWN, states.SEEKING_SPAWN, states.SEEKING_CONTAINER])

const onDepleted = state => StateChange(creep => {
  if (creep.carry.energy === 0) {
    return Transition(state, 'depleted')
  }
}, )

senses.isDepleted = {
  needsSource: onDepleted(states.SEEKING_SOURCE),
  needsCharge: onDepleted(states.SEEKING_CHARGE),
  needsContainer: onDepleted(states.SEEKING_CONTAINER)
}

senses.shouldSeek = {}

senses.shouldSeek.damage = StateChange(creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return Transition(states.SEEKING_DAMAGE, 'creep full')
  }
}, [states.SEEKING_DAMAGE])

senses.shouldSeek.controller = StateChange(creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return Transition(states.SEEKING_CONTROLLER, 'creep full')
  }
}, [states.SEEKING_CONTROLLER])

senses.shouldSeek.spawn = StateChange(creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return Transition(states.SEEKING_SPAWN, 'creep full')
  }
}, [states.SEEKING_SPAWN])

senses.shouldSeek.site = StateChange(creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return Transition(states.SEEKING_SITE, 'creep full')
  }
}, [states.SEEKING_SITE])

senses.shouldSeek.charge = StateChange(creep => {
  if (creep.carry.energy !== creep.carryCapacity) {
    return Transition(states.SEEKING_CHARGE, 'creep not full')
  }
}, [states.SEEKING_CHARGE])

senses.shouldSeek.source = StateChange(creep => {
  if (creep.carry.energy !== creep.carryCapacity) {
    return Transition(states.SEEKING_SOURCE, 'creep not full')
  }
}, [states.SEEKING_SOURCE])

senses.shouldSeek.emptyContainer = StateChange(creep => {
  const isFull = creep.carry.energy === creep.carryCapacity
  const container = terrain.findClosestContainer(creep.pos, {
    notFull: true
  })

  if (isFull && container) {
    return Transition(states.SEEKING_CONTAINER, 'full & container present')
  }
}, [states.SEEKING_CONTAINER])

senses.shouldSeek.container = StateChange(creep => {
  const isFull = creep.carry.energy === creep.carryCapacity
  const container = terrain.findClosestContainer(creep.pos, {
    notFull: false
  })

  if (isFull && container) {
    return Transition(states.SEEKING_CONTAINER, 'is full & container present')
  }
}, [states.SEEKING_CONTAINER])

senses.atSource = StateChange(creep => {
  const source = getObj(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => Transition(states.HARVEST, 'harvested successfully'),
    [ERR_NOT_IN_RANGE]: () => Transition(states.SEEKING_SOURCE, 'not in range')
  })
}, [states.HARVEST, states.SEEKING_SOURCE])

senses.isSigned = StateChange(creep => {
  const controller = getObj(creep.memory.controllerId)
  if (controller && controller.sign && controller.sign.text === constants.sign) {
    return Transition(states.DYING, 'tired of life')
  }
}, [states.DYING])

senses.targetIsFull = {}

senses.targetIsFull.container = StateChange(creep => {
  const container = getObj(creep.memory.containerId)
  if (container && container.store.energy === CONTAINER_CAPACITY) {
    return Transition(states.SEEKING_SOURCE, 'container full')
  }
}, [states.SEEKING_SOURCE])

module.exports = senses
