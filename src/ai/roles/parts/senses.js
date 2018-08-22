
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
  const controller = Game.getObjectById(creep.memory.controllerId)
  creep.moveTo(controller)

  return misc.switch(creep.upgradeController(controller), {
    [OK]: () => 'CHARGE_SPAWN',
    [ERR_NOT_IN_RANGE]: () => 'SEEKING_SPAWN'
  })
}

senses.isDepleted = creep => {
  if (creep.carry.energy === 0) {
    return 'SEEKING_SOURCE'
  }
}

senses.isDepleted = creep => {
  if (creep.carry.energy === 0) {
    return 'SEEKING_CHARGE'
  }
}







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

senses.isDepleted = creep => {
  if (creep.carry.energy === 0) {
    return 'SEEKING_SOURCE'
  }
}



senses.shouldSeekCharge = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SITE'
  } else {
    return 'SEEKING_CHARGE'
  }
}

senses.shouldSeekSource = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SPAWN'
  } else {
    return 'SEEKING_SOURCE'
  }
}

senses.shouldSeekController = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    return 'SEEKING_SPAWN'
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

module.exports = senses
