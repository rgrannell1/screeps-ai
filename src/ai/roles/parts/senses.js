
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

const getObj = Game.getObjectById

senses.atDamage = StateChange((creep, states2) => {
  const site = getObj(creep.memory.damageId)

  creep.moveTo(site)
  return misc.switch(creep.repair(site), {
    [OK]: () => states.REPAIR,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_CHARGE
  })
}, [states.REPAIR, states.SEEKING_CHARGE])

senses.repairComplete = StateChange((creep, states2) => {
  const site = getObj(creep.memory.damageId)

  return misc.switch(-100, {
    [OK]: () => states.SEEKING_CHARGE,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_CHARGE
  })


}, [states.SEEKING_CHARGE])

senses.atCharge = StateChange((creep, states2) => {
  const loaded = getObj(creep.memory.sourceId)
  const source = loaded
    ? loaded
    : terrain.findClosestSource(creep.pos)

  creep.memory.sourceId = source.id

  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => states.CHARGE,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_CHARGE
  })
}, [states.CHARGE, states.SEEKING_CHARGE])

senses.atController = StateChange((creep, states2) => {
  const controller = getObj(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.upgradeController(controller), {
    [OK]: () => states.UPGRADING,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_CONTROLLER,
    [ERR_NO_BODYPART]: () => {

    }
  })
}, [states.UPGRADING, states.SEEKING_CONTROLLER])

senses.atContainerFromSpawn = StateChange((creep, states2) => {
  const container = getObj(creep.memory.containerId)

  if (!container || container.store.energy < CONTAINER_CAPACITY) {
    return states.SEEKING_CONTAINER
  }

  creep.moveTo(container)

  return misc.switch(creep.withdraw(container, RESOURCE_ENERGY), {
    [OK]: () => states.DRAIN_CONTAINER,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_CONTAINER,
    [ERR_FULL]: () => states.DRAIN_CONTAINER,
    default (val) {
      console.log(`at container code ${val}`)
    }
  })
}, [states.SEEKING_CONTAINER, states.DRAIN_CONTAINER])

senses.containerSeekerNeedsSpawn = StateChange((creep, states2) => {
  const container = getObj(creep.memory.containerId)

  if (!container || container.store.energy < CONTAINER_CAPACITY) {
    return states.SEEKING_SPAWN
  }

  creep.moveTo(container)

  return misc.switch(creep.transfer(container, RESOURCE_ENERGY), {
    [OK]: () => states.CHARGE_CONTAINER,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_CONTAINER,
    [ERR_FULL]: () => states.CHARGE_CONTAINER,
    default (val) {
      console.log(`at container code ${val}`)
    }
  })
}, [states.SEEKING_SPAWN, states.CHARGE_CONTAINER, states.SEEKING_CONTAINER])

senses.atContainer = StateChange((creep, states2) => {
  const container = getObj(creep.memory.containerId)

  if (!container) {
    return states.SEEKING_SOURCE
  }

  if (container.store.energy < CONTAINER_CAPACITY) {
    return states.SEEKING_SOURCE
  }

  creep.moveTo(container)

  return misc.switch(creep.transfer(container, RESOURCE_ENERGY), {
    [OK]: () => states.CHARGE_CONTAINER,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_CONTAINER,
    [ERR_FULL]: () => states.CHARGE_CONTAINER,
    default (val) {
      console.log(`at container code ${val}`)
    }
  })
}, [states.SEEKING_SOURCE, states.CHARGE_CONTAINER, states.SEEKING_CONTAINER])

senses.canSignController = StateChange((creep, states2) => {
  const controller = getObj(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.signController(controller, constants.sign), {
    [OK]: () => states.SIGNING,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_CONTROLLER,
    [ERR_NO_BODYPART]: () => {

    },
    default (val) {
      console.log(`sign-code ${val}`)
    }
  })
}, [states.SIGNING, states.SEEKING_CONTROLLER])

senses.atSite = StateChange((creep, states2) => {
  const site = getObj(creep.memory.siteId)
  creep.moveTo(site)

  return misc.switch(creep.build(site), {
    [OK]: () => states.BUILDING,
    [ERR_INVALID_TARGET]: () => states.BUILDING,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_SITE
  })
}, [states.BUILDING, states.SEEKING_SITE])

senses.noSitesLeft = StateChange((creep, states2) => {

}, [])

senses.atSource = StateChange((creep, states2) => {
  const source = getObj(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => states.CHARGE,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_CHARGE
  })
}, [states.CHARGE, states.SEEKING_CHARGE])

senses.atSpawn = StateChange((creep, states2) => {
  const spawn = getObj(creep.memory.spawnId)
  creep.moveTo(spawn)

  return misc.switch(creep.transfer(spawn, RESOURCE_ENERGY), {
    [OK]: () => states.CHARGE_SPAWN,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_SPAWN,
    [ERR_FULL] () {
      // -- TODO
    },
    [ERR_NOT_ENOUGH_RESOURCES]: () => 'aaaaaaaaaaa',
    default (code) {
      creep.say(`charge ${code}`)
    }
  })
}, [states.CHARGE_SPAWN, states.SEEKING_SPAWN])

senses.atSpawnFromContainer = StateChange((creep, states2) => {
  const spawn = getObj(creep.memory.spawnId)
  creep.moveTo(spawn)

  return misc.switch(creep.transfer(spawn, RESOURCE_ENERGY), {
    [OK]: () => states.CHARGE_SPAWN,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_SPAWN,
    [ERR_FULL] () {
      // -- TODO
    },
    [ERR_NOT_ENOUGH_RESOURCES]: () => states.SEEKING_CONTAINER,
    default (code) {
      creep.say(`charge ${code}`)
    }
  })
}, [states.CHARGE_SPAWN, states.SEEKING_SPAWN, states.SEEKING_CONTAINER])

const onDepleted = state => StateChange((creep, states2) => {
  if (creep.carry.energy === 0) {
    return state
  }
}, )

senses.isDepleted = {
  needsSource: onDepleted(states.SEEKING_SOURCE),
  needsCharge: onDepleted(states.SEEKING_CHARGE),
  needsContainer: onDepleted(states.SEEKING_CONTAINER)
}

senses.shouldSeek = {}

senses.shouldSeek.damage = StateChange((creep, states2) => {
  if (creep.carry.energy === creep.carryCapacity) {
    return states.SEEKING_DAMAGE
  }
}, [states.SEEKING_DAMAGE])

senses.shouldSeek.controller = StateChange((creep, states2) => {
  if (creep.carry.energy === creep.carryCapacity) {
    return states.SEEKING_CONTROLLER
  }
}, [states.SEEKING_CONTROLLER])

senses.shouldSeek.spawn = StateChange((creep, states2) => {
  if (creep.carry.energy === creep.carryCapacity) {
    return states.SEEKING_SPAWN
  }
}, [states.SEEKING_SPAWN])

senses.shouldSeek.site = StateChange((creep, states2) => {
  if (creep.carry.energy === creep.carryCapacity) {
    return states.SEEKING_SITE
  }
}, [states.SEEKING_SITE])

senses.shouldSeek.charge = StateChange((creep, states2) => {
  if (creep.carry.energy !== creep.carryCapacity) {
    return states.SEEKING_CHARGE
  }
}, [states.SEEKING_CHARGE])

senses.shouldSeek.source = StateChange((creep, states2) => {
  if (creep.carry.energy !== creep.carryCapacity) {
    return states.SEEKING_SOURCE
  }
}, [states.SEEKING_SOURCE])

senses.shouldSeek.container = StateChange((creep, states2) => {
  const isFull = creep.carry.energy === creep.carryCapacity
  const hasContainer = terrain.exists.container(creep.room.name)

  if (isFull && hasContainer) {
    return states.SEEKING_CONTAINER
  }
}, [states.SEEKING_CONTAINER])

senses.atSource = StateChange((creep, states2) => {
  const source = getObj(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => states.HARVEST,
    [ERR_NOT_IN_RANGE]: () => states.SEEKING_SOURCE
  })
}, [states.HARVEST, states.SEEKING_SOURCE])

senses.isSigned = StateChange((creep, states2) => {
  const controller = getObj(creep.memory.controllerId)
  if (controller && controller.sign && controller.sign.text === constants.sign) {
    return states.DYING
  }
}, [states.DYING])

senses.targetIsFull = {}

senses.targetIsFull.container = StateChange((creep, states2) => {
  const container = getObj(creep.memory.containerId)
  if (container && container.store.energy === CONTAINER_CAPACITY) {
    return states.SEEKING_SOURCE
  }
}, [states.SEEKING_SOURCE])

module.exports = senses
