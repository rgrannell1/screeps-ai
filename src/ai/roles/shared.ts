
import Architecture from '../modules/architecture'
import terrain from '../terrain'
import structures from '../structures'
import telemetry from '../telemetry'
import constants from '../constants'
import logger from '../logger'
import creeps from '../creeps'
import {Priority} from '../types'

const shared = {} as any

shared.renewCreep = (creep:Creep):void => {
  creep.memory.state = 'renew_creep'
  const [spawn] = terrain.findSpawns(creep.room.name)

  // -- TODO wrap these commands in telemetry functions that write to creeps memory.
  const moveCode = creep.moveTo(spawn.pos)
  const renewCode = spawn.renewCreep(creep)
}

shared.chargeCreep = (sinks:string[], creep:Creep):void => {
  creep.memory.state = 'charge_creep'

  const energy = structures.findEnergyDrop(creep.room.name)
  if (energy) {
    const pickupCode = creep.pickup(energy)

    if (pickupCode === ERR_NOT_IN_RANGE) {
      const moveCode = creep.moveTo(energy)
    }

    return
  }

  const source = structures.findEnergySource(creep.room.name, sinks)

  if (!source) {
    // -- navigate to the previous charge source, to speed up next cycle's charging.
    if (creep.memory.previousChargeSource) {
      const oldSource = Game.getObjectById(creep.memory.previousChargeSource)

      if (oldSource) {
        creep.moveTo(oldSource.pos)
      } else {
        delete creep.memory.previousChargeSource
      }
    }
    return
  }

  creep.memory.previousChargeSource = source.value.id
  const moveCode = creep.moveTo(source.value.pos)

  // -- todo prioritise tombstones and all

  const chargeCode = creep.withdraw(source.value, RESOURCE_ENERGY)
}

shared.chargeTarget = (sinkPriorities:Array<Priority>, creep:any):void => {
  creep.memory.state = 'charge_target'
  const priorities = creeps.chooseEnergySink(creep, sinkPriorities)
  const target = structures.findEnergySink(creep.room.name, priorities.priorities)

  if (!target) {
    console.log(`no empty targets found for ${priorities}`)
    return
  }

  const transferCode = creep.transfer(target.value, RESOURCE_ENERGY)

  if (transferCode === ERR_NOT_IN_RANGE) {
    const moveCode = creep.moveTo(target.value.pos)
  }

  for (const resource of Object.keys(creep.carry)) {
    creep.transfer(target.value, resource)
  }
}

shared.chargeLocalTarget = (sinkPriorities:Array<Priority>, creep:any):void => {
  creep.memory.state = 'charge_local_target'

  if (creep.room.name !== creep.memory.initialRoom) {
    creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.initialRoom)))
    return
  }

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
    creep_name: creep.name,
    room_name: creep.room.name
  })
  */

  const transferCode = creep.transfer(target.value, RESOURCE_ENERGY)
}

shared.repairTarget = (creep:Creep) => {
  creep.memory.state = 'repair_target'
  const damaged = structures.findDamagedStructure(creep.room.name, constants.repairPriorities)

  if (!damaged) {
    return
  }

  const repairCode = creep.repair(damaged)

  if (repairCode === ERR_NOT_IN_RANGE) {
    const moveCode = creep.moveTo(damaged.pos)
  }
}

shared.buildSite = (creep:Creep) => {
  creep.memory.state = 'build_site'
  const site = Architecture.findBuildingSite(creep.room.name, constants.buildPriorities)

  if (!site) {
    return
  }

  const buildCode = creep.build(site)

  if (buildCode === ERR_NOT_IN_RANGE) {
    const moveCode = creep.moveTo(site.pos)
  }
}

shared.killCreep = (creep:Creep) => {
  creep.suicide()
}

shared.signController = (creep:Creep, controller:StructureController, sign:string) => {
  creep.moveTo(controller.pos)
  creep.signController(controller, sign)
}

shared.upgradeController = (creep:Creep) => {
  creep.memory.state = 'upgrade_controller'

  const controller = terrain.findController(creep.room.name)

  const upgradeCode = creep.upgradeController(controller)

  if (upgradeCode === ERR_NOT_IN_RANGE) {
    const moveCode = creep.moveTo(controller.pos)
  }
}

shared.harvestSource = (creep:Creep):void => {
  creep.memory.state = 'harvest_source'

  if (creep.memory.externalRoom && creep.room.name !== creep.memory.externalRoom) {
    creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.externalRoom)))
    return
  }

  const [source] = terrain.findSources(creep.room.name)

  const chargeCode = creep.harvest(source)

  if (chargeCode === ERR_NOT_IN_RANGE) {
    const moveCode = creep.moveTo(source.pos)
  }
}

shared.harvestMinerals = (creep:Creep):void => {
  creep.memory.state = 'harvest_minerals'

  if (creep.memory.externalRoom && creep.room.name !== creep.memory.externalRoom) {
    creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.externalRoom)))
    return
  }

  const [minerals] = terrain.findMinerals(creep.room.name)

  const chargeCode = creep.harvest(minerals)

  if (chargeCode == ERR_NOT_IN_RANGE) {
    const moveCode = creep.moveTo(minerals.pos)
  }
}

shared.claimRoom = (creep:Creep):void => {
  creep.memory.state = 'claim_room'

  if (creep.memory.externalRoom && creep.room.name !== creep.memory.externalRoom) {
    creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.externalRoom)))
    return
  }

  creep.moveTo(creep.room.controller)
  creep.claimController(creep.room.controller)
}

shared.reclaimCreep = (creep:Creep):void => {
  const [spawn] = terrain.findSpawns(creep.room.name)

  creep.moveTo(spawn.pos)
  spawn.recycleCreep(creep)
}

export default shared
