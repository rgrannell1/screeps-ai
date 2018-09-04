
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

const priorityLists = {}
priorityLists.sink = {
  spawns: [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE],
  towers: [STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE],
  extensions: [STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_STORAGE]
}
priorityLists: {

}

run.chargeCreep = creep => {
  creep.memory.state = 'charge_creep'
  const source = structures.findEnergySource(creep.room.name, [
    STRUCTURE_CONTAINER,
    STRUCTURE_STORAGE
  ])

  // -- TODO wrap these commands in telemetry functions that write to creeps memory.
  const moveCode = creep.moveTo(source.value.pos)
  const withdrawCode = creep.withdraw(source.value, RESOURCE_ENERGY)

  // pass to logger
}

const hasPriority = (transferers, priority) => {
  return transferers.some(([_, data]) => data.memory.sinkPriority === priority)
}

function chooseSink (creep) {
  let priorities = priorityLists.sink.spawns

  const others = Object.entries(Game.creeps)
    .filter(([name, data]) => {
      return data.memory.role === 'transferer' && name !== creep.name
    })

  if (creep.memory.sinkPriority) {
    priorities = priorityLists.sink[creep.memory.sinkPriority]
  } else {
    // -- not currently set in memory.

    if (!hasPriority(others, 'spawns')) {
      priorities = priorityLists.sink.spawns
      creep.memory.sinkPriority = 'spawns'
    } else if (!hasPriority(others, 'towers')) {
      priorities = priorityLists.sink.towers
      creep.memory.sinkPriority = 'towers'
    } else if (!hasPriority(others, 'extensions')) {
      priorities = priorityLists.sink.extensions
      creep.memory.sinkPriority = 'extensions'
    }
  }

  if (!priorities) {
    console.log(`missing priorities for "${creep.memory.sinkPriority}"`)
    delete creep.memory.sinkPriority
  }

  return priorities
}

run.chargeTarget = creep => {
  creep.memory.state = 'charge_target'

  const priorities = chooseSink(creep)
  const target = structures.findEnergySink(creep.room.name, priorities)

  if (!target) {
    console.log(`no empty targets found for ${priorities}`)
    return
  }

  const moveCode = creep.moveTo(target.value.pos)
  const transferCode = creep.transfer(target.value, RESOURCE_ENERGY)
}

module.exports = {run}
