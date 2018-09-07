
import misc from '../misc'
import middleware from './middleware'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'

const sinkPriorities = [
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

const run = creep => {
  if (creep.carry.energy < creep.carryCapacity) {
    chargeCreep(creep)
  } else if (creep.carry.energy === creep.carryCapacity) {
    chargeTarget(creep)
  }
}

const chargeCreep = creep => {
  creep.memory.state = 'charge_creep'
  const source = structures.findEnergySource(creep.room.name, [STRUCTURE_CONTAINER, STRUCTURE_STORAGE])

  // -- TODO wrap these commands in telemetry functions that write to creeps memory.
  const moveCode = creep.moveTo(source.value.pos)
  const withdrawCode = creep.withdraw(source.value, RESOURCE_ENERGY)
}

const chargeTarget = creep => {
  creep.memory.state = 'charge_target'
  const priorities = creeps.chooseEnergySink(creep, sinkPriorities)
  const target = structures.findEnergySink(creep.room.name, priorities)

  if (!target) {
    console.log(`no empty targets found for ${priorities}`)
    return
  }

  const moveCode = creep.moveTo(target.value.pos)
  const transferCode = creep.transfer(target.value, RESOURCE_ENERGY)
}

export default {run}
