
import terrain from '../terrain'
import structures from '../structures'
import telemetry from '../telemetry'
import logger from '../logger'
import creeps from '../creeps'
import {Priority} from '../types'

const shared = {} as any

shared.findUnexploredRooms = (creep:Creep):void => {
  const nearby = terrain.findUnexploredRooms(creep.room.name)

  if (!nearby) {
    return
  }
  const target = nearby[0]
  const exit = creeps.findExitPath(creep, target)

  creep.moveTo(exit)

  return

  if (creep.room.name !== creep.memory.spawnRoom && target) {
    Memory.externalRooms[target] = {
      controller: creep.room.controller,
      user: creep.room.controller ? creep.room.controller.owner : null
    }
  }
}

shared.renewCreep = (creep:Creep):void => {
  creep.memory.state = 'renew_creep'
  const [spawn] = terrain.findSpawns(creep.room.name)

  // -- TODO wrap these commands in telemetry functions that write to creeps memory.
  const moveCode = creep.moveTo(spawn.pos)
  const renewCode = spawn.renewCreep(creep)
}

shared.chargeCreep = (sinks:string[], creep:Creep):void => {
  creep.memory.state = 'charge_creep'
  const source = structures.findEnergySource(creep.room.name, sinks)

  if (!source) {
    return
  }

  const moveCode = creep.moveTo(source.value.pos)

  /*
  logger.data('creep move status', 'creep_move', {
    code: telemetry.moveCode(moveCode),
    creepName: creep.name,
    roomName: creep.room.name
  })
  */

  const chargeCode = creep.withdraw(source.value, RESOURCE_ENERGY)

  /*

  logger.data('creep withdraw status', 'creep_withdraw', {
    code: telemetry.withdrawCode(chargeCode),
    creepName: creep.name,
    roomName: creep.room.name
  })
  */
}

shared.chargeTarget = (sinkPriorities:Array<Priority>, creep:any):void => {
  creep.memory.state = 'charge_target'
  const priorities = creeps.chooseEnergySink(creep, sinkPriorities)
  const target = structures.findEnergySink(creep.room.name, priorities.priorities)

  if (!target) {
    console.log(`no empty targets found for ${priorities}`)
    return
  }

  const moveCode = creep.moveTo(target.value.pos)
  /*
  logger.data('creep move status', 'creep_move', {
    code: telemetry.moveCode(moveCode),
    creepName: creep.name,
    roomName: creep.room.name
  })
  */

  const transferCode = creep.transfer(target.value, RESOURCE_ENERGY)
}

shared.buildSite = (creep:Creep) => {
  creep.memory.state = 'build_site'

  const site = structures.findSite(creep.room.name, [
    STRUCTURE_CONTAINER,
    STRUCTURE_EXTENSION,
    STRUCTURE_TOWER,
    STRUCTURE_STORAGE,
    STRUCTURE_ROAD,
    STRUCTURE_RAMPART
  ])

  if (!site) {
    return
  }

  const moveCode = creep.moveTo(site.pos)
  const buildCode = creep.build(site)

  console.log([moveCode, buildCode])
}

shared.killCreep = (creep:Creep) => {
  creep.suicide()
}

shared.signController = (creep:Creep, controller:StructureController, sign:string) => {
  creep.signController(controller, sign)
}

shared.upgradeController = (creep:Creep) => {
  creep.memory.state = 'upgrade_controller'

  const controller = terrain.findController(creep.room.name)

  const moveCode = creep.moveTo(controller.pos)
  /*
  logger.data('creep move status', 'creep_move', {
    code: telemetry.moveCode(moveCode),
    creepName: creep.name,
    roomName: creep.room.name
  })
  */
  const upgradeCode = creep.upgradeController(controller)
}

shared.harvestSource = (creep:Creep):void => {
  creep.memory.state = 'harvest_source'
  const [source] = terrain.findSources(creep.room.name)

  const moveCode = creep.moveTo(source.pos)
  /*
  logger.data('creep move status', 'creep_move', {
    code: telemetry.moveCode(moveCode),
    creepName: creep.name,
    roomName: creep.room.name
  })
  */

  const chargeCode = creep.harvest(source)
}

export default shared
