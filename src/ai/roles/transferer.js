
const misc = require('../misc')
const middleware = require('./middleware')
const blessed = require('../blessed')

const run = creep => {
  if (creep.carry.energy < creep.carryCapacity) {
    run.chargeCreep(creep)
  } else if (creep.carry.energy === creep.carryCapacity) {
    run.chargeTarget(creep)
  } else {
    console.log('invalid transferer state')
  }
}

run.chargeCreep = creep => {
  creep.memory.state = 'charge_creep'
  const source = structures.findEnergySource(creep.room.name, ['container'])

  // -- TODO wrap these commands in telemetry functions that write to creeps memory.
  misc.switch(creep.moveTo(source.pos), {
    [OK] () {},
    [ERR_NOT_IN_RANGE] () {},
    [ERR_INVALID_TARGET] (val) {
      console.log(`invalid target`)
    },
    default (val) {
      console.log(`invalid move code ${val}`)
    }
  })

  const withdrawCode = creep.withdraw(source, RESOURCE_ENERGY)

  misc.switch(withdrawCode, {
    [OK] () {},
    [ERR_FULL] () {
      console.log(blessed.red(`${creep.name} already full, no need to drain`))
    },
    [ERR_INVALID_TARGET] () {
      console.log(blessed.red(`${creep.name} trying to drain invalid source:\n${JSON.stringify(source, null, 2)}`))
    },
    [ERR_NOT_IN_RANGE] () {},
    default (val) {
      console.log(`invalid DRAINING_SOURCE code ${val}`)
    }
  })
}

const hasPriority = (transferers, priority) => {
  return transferers.some(([_, data]) => data.memory.priority === priority)
}

const sinkPriorities = {
  spawn: ['spawn', 'towers', 'extensions'],
  towers: ['towers', 'spawn', 'extensions'],
  extensions: ['extensions', 'towers', 'spawn']
}

run.chargeTarget = creep => {
  creep.memory.state = 'charge_target'

  const others = Object.entries(Game.creeps)
    .filter(([name, data]) => data.memory.role === 'transferer' && name !== creep.name)

  let priorities = sinkPriorities.spawn

  if (creep.memory.priority) {
    priorities = sinkPriorities[creep.memory.priority]
  } else {
    // -- not currently set in memory.

    if (!hasPriority(others, 'spawn')) {
      priorities = sinkPriorities.spawn
      creep.memory.priority = 'spawn'
    } else if (!hasPriority(others, 'towers')) {
      priorities = sinkPriorities.towers
      creep.memory.priority = 'towers'
    } else if (!hasPriority(others, 'extensions')) {
      priorities = sinkPriorities.extensions
      creep.memory.priority = 'extensions'
    }
  }

  if (!priorities) {
    delete creep.memory.priority
    console.log(`   ${creep.memory.priority}`)
  }

  const target = structures.findEnergySink(creep.room.name, priorities)

  if (!target) {
    console.log(`no empty targets found for ${priorities}`)
    return
  }

  misc.switch(creep.moveTo(target.value.pos), {
    [OK] () {},
    [ERR_NOT_IN_RANGE] () {},
    [ERR_INVALID_TARGET] (val) {
      console.log(`invalid target`)
    },
    default (val) {
      console.log(`invalid move code ${val}`)
    }
  })

  const transferCode = creep.transfer(target.value, RESOURCE_ENERGY)
  misc.switch(transferCode, {
    [OK] () {},
    [ERR_FULL] () {
      console.log(blessed.red(`${creep.name} already full, no need to drain`))
    },
    [ERR_INVALID_TARGET] () {
      console.log(blessed.red(`${creep.name} trying to charge invalid target:\n${JSON.stringify(target, null, 2)}`))
    },
    [ERR_NOT_IN_RANGE] () {},
    default (val) {
      console.log(`invalid transfer code ${val}`)
    }
  })
}

module.exports = {run}
