
const misc = require('../misc')
const middleware = require('./middleware')
const blessed = require('../blessed')
const creeps = require('../creeps')

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
  const source = structures.findEnergySource(creep.room.name, [STRUCTURE_CONTAINER, STRUCTURE_STORAGE])

  // -- TODO wrap these commands in telemetry functions that write to creeps memory.
  const moveCode = creep.moveTo(source.value.pos)
  const withdrawCode = creep.withdraw(source.value, RESOURCE_ENERGY)

  // pass to logger
}

const priorities = {}

priorities.sink = [
  {
    label: 'spawns',
    priorities: [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE]
  },
  {
    label: 'towers',
    priorities: [STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE]
  },
  {
    label: 'extensions',
    priorities: [STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_STORAGE]
  }
]

run.chargeTarget = creep => {
  creep.memory.state = 'charge_target'
  const target = structures.findEnergySink(creep.room.name, creeps.chooseEnergySink(creep, priorities.sink))

  if (!target) {
    console.log(`no empty targets found for ${priorities}`)
    return
  }

  const moveCode = creep.moveTo(target.value.pos)
  const transferCode = creep.transfer(target.value, RESOURCE_ENERGY)
}

module.exports = {run}
