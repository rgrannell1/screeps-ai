
import misc from '../misc'
import middleware from './middleware'
import blessed from '../blessed'
import creeps from '../creeps'
import structures from '../structures'

const run = creep => {
  if (creep.carry.energy === 0) {
    chargeCreep(creep)
  } else if (creep.carry.energy !== 0) {
    buildSite(creep)
  }
}

const chargeCreep = creep => {
  creep.memory.state = 'charge_creep'
  const source = structures.findEnergySource(creep.room.name, [STRUCTURE_CONTAINER, STRUCTURE_STORAGE])

  const moveCode = creep.moveTo(source.value.pos)
  const withdrawCode = creep.withdraw(source.value, RESOURCE_ENERGY)
}

const buildSite = creep => {
  creep.memory.state = 'build_site'

  const site = structures.findSite(creep.room.name, [
    STRUCTURE_CONTAINER,
    STRUCTURE_EXTENSION,
    STRUCTURE_TOWER,
    STRUCTURE_STORAGE,
    STRUCTURE_ROAD,
    STRUCTURE_RAMPART
  ])

  const moveCode = creep.moveTo(site.pos)
  const buildCode = creep.build(site)
}

export default {run}
