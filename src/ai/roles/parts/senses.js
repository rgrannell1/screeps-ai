
const misc = require('../../misc')
const terrain = require('../../terrain')
const constants = require('../../constants')
const senses = {}

senses.atDamage = creep => {
  const site = Game.getObjectById(creep.memory.damageId)

  creep.moveTo(site)
  return misc.switch(creep.repair(site), {
    [OK]: () => 'REPAIR',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CHARGE'
  })
}

senses.atCharge = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => 'CHARGE',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CHARGE'
  })
}

senses.atController = creep => {
  const controller = Game.getObjectById(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.upgradeController(controller), {
    [OK]: () => 'UPGRADING',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CONTROLLER',
    [ERR_NO_BODYPART]: () => {

    }
  })
}

senses.atContainer = creep => {
  const container = Game.getObjectById(creep.memory.containerId)
  creep.moveTo(container)

  return misc.switch(creep.transfer(container, RESOURCE_ENERGY), {
    [OK]: () => 'CHARGE_CONTAINER',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CONTAINER'
  })
}

senses.canSignController = creep => {
  const controller = Game.getObjectById(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.signController(controller, constants.sign), {
    [OK]: () => 'SIGNING',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CONTROLLER',
    [ERR_NO_BODYPART]: () => {

    },
    default (val) {
      console.log(`sign-code ${val}`)
    }
  })
}

senses.atSite = creep => {
  const site = Game.getObjectById(creep.memory.siteId)
  creep.moveTo(site)

  return misc.switch(creep.build(site), {
    [OK]: () => 'BUILDING',
    [ERR_INVALID_TARGET]: () => 'BUILDING',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_SITE'
  })
}

senses.noSitesLeft = creep => {

}

senses.atSource = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => 'CHARGE',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CHARGE'
  })
}

senses.atSpawn = creep => {
  const spawn = Game.getObjectById(creep.memory.spawnId)
  creep.moveTo(spawn)

  return misc.switch(creep.transfer(spawn, RESOURCE_ENERGY), {
    [OK]: () => 'CHARGE_SPAWN',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_SPAWN',
    [ERR_FULL] () {
      // -- TODO
    },
    default (code) {
      creep.say(`charge ${code}`)
    }
  })
}

const onDepleted = state => creep => {
  if (creep.carry.energy === 0) {
    return state
  }
}

senses.isDepleted = {
  needsSource: onDepleted('SEEKING_SOURCE'),
  needsCharge: onDepleted('SEEKING_CHARGE'),
  needsContainer: onDepleted('SEEKING_CONTAINER')
}

senses.shouldSeek = {}

senses.shouldSeek.damage = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_DAMAGE'
  }
}

senses.shouldSeek.controller = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_CONTROLLER'
  }
}

senses.shouldSeek.spawn = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SPAWN'
  }
}

senses.shouldSeek.site = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SITE'
  }
}

senses.shouldSeek.charge = creep => {
  if (creep.carry.energy !== creep.carryCapacity) {
    return 'SEEKING_CHARGE'
  }
}

senses.shouldSeek.source = creep => {
  if (creep.carry.energy !== creep.carryCapacity) {
    return 'SEEKING_SOURCE'
  }
}

senses.shouldSeek.container = creep => {
  const isFull = creep.carry.energy === creep.carryCapacity

  if (isFull && terrain.exists.container(creep.room.name)) {
    return 'SEEKING_CONTAINER'
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

senses.isSigned = creep => {
  const controller = Game.getObjectById(creep.memory.controllerId)
  if (controller && controller.sign && controller.sign.text === constants.sign) {
    return 'DYING'
  }
}

module.exports = senses
