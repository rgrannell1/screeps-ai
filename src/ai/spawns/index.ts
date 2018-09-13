
import creeps from '../creeps'
import terrain from '../terrain'
import structures from '../structures'
import constants from '../constants'
import telemetry from '../telemetry'
import {RoleLabel} from '../types'

const creepRequired = {} as {[str: string]:Function}

creepRequired.harvester = (roomName:string):boolean => {
  const counts = {
    young: creeps.countYoungCreeps('harvester'),
    source: terrain.findSources(roomName).length
  }

  return counts.young < counts.source
}

creepRequired.upgrader = (roomName:string):boolean => {
  const counts = {
    young: creeps.countYoungCreeps('upgrader')
  }

  return counts.young < 3
}

creepRequired.transferer = (roomName:string):boolean => {
  const counts = {
    young: creeps.countYoungCreeps('upgrader'),
    containers: structures.container.findAll(roomName),
    towers: structures.tower.findAll(roomName)
  }

  const expected = 1 + Math.floor(counts.containers.length + (counts.towers.length / 2))
  return counts.young < expected
}

creepRequired.builder = (roomName:string):boolean => {
  const room = Game.rooms[roomName]
  const counts = {
    young: creeps.countYoungCreeps('builder')
  }

  const SITE_TO_BUILDER_RATIO = 20
  const ENERGY_TO_BUILDER_RATIO = 2000

  const sites = room.find(FIND_CONSTRUCTION_SITES)
  const siteCount = sites.length
  const totalRequiredEnergy = sites
    .reduce((sum, site) => sum + (site.progressTotal - site.progress), 0) || 0

  const expected = Math.max(
    1,
    Math.ceil(siteCount / SITE_TO_BUILDER_RATIO),
    Math.ceil(totalRequiredEnergy / ENERGY_TO_BUILDER_RATIO))

  return counts.young < expected
}

creepRequired.scribe = (roomName:string):boolean => {
  const room = Game.rooms[roomName]
  const counts = {
    young: creeps.countYoungCreeps('builder')
  }

  return counts.young === 0 && room.controller.sign.text !== constants.sign
}

const spawns = {} as {[str: string]:Function}

const priorities = [
  'upgrader',
  'harvester',
  'transferer',
  'builder',
  'scribe'
] as Array<RoleLabel>

const createCreep = (roomName:string, spawn:StructureSpawn, role:RoleLabel) => {
  const room = Game.rooms[roomName]

  const roomCapacity = room.energyAvailable
  const parts = creeps[role].body(roomCapacity)
  const creepCost = creeps.getCost(parts)

  if (room.energyAvailable < creepCost) {
    return
  }

  const creepCode = spawn.createCreep(parts, creeps.pickCreepName(role), {
    role,
    spawnRoom: spawn.room.name
  })

  // -- telemetry for spawn.

}

const spawner = (roomName:string, spawn:StructureSpawn):void => {
  for (const role of priorities) {
    const shouldBuild = creepRequired[role](roomName)
    if (shouldBuild) {
      createCreep(roomName, spawn, role)
      break
    }
  }
}

export default {spawner}
