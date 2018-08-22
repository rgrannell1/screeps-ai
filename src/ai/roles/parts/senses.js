
const misc = require('../../misc')
const constants = require('../../constants')
const senses = {}

senses.atCharge = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.harvest(source), {
    [OK]: () => 'SEEKING_SITE',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CHARGE'
  })
}

senses.atController = creep => {
  const controller = Game.getObjectById(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.upgradeController(controller), {
    [OK]: () => 'UPGRADING',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_CONTROLLER'
  })
}

senses.atSite = creep => {
  const site = Game.getObjectById(creep.memory.siteId)
  creep.moveTo(site)

  return misc.switch(creep.build(site), {
    [OK]: () => 'BUILDING',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_SITE'
  })
}

senses.atSource = creep => {
  const source = Game.getObjectById(creep.memory.sourceId)
  creep.moveTo(source)
  return misc.switch(creep.CHARGE(source), {
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
    default (code) {
      creep.say(`charge ${code}`)
    }
  })
}

senses.isDepletedSource = creep => {
  if (creep.carry.energy === 0) {
    return 'SEEKING_SOURCE'
  }
}

senses.isDepleted = creep => {
  if (creep.carry.energy === 0) {
    return 'SEEKING_CHARGE'
  }
}

senses.shouldSeekController = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SOURCE'
  }
}

senses.isDepleted = creep => {
  if (creep.carry.energy === 0) {
    return 'SEEKING_SOURCE'
  }
}

senses.shouldSeekCharge = creep => {
  if (creep.carry.energy !== creep.carryCapacity) {
    return 'SEEKING_CHARGE'
  }
}

senses.shouldSeekSource = creep => {
  if (creep.carry.energy !== creep.carryCapacity) {
    return 'SEEKING_SOURCE'
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
