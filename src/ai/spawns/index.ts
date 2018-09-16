
import creeps from '../creeps'
import terrain from '../terrain'
import structures from '../structures'
import constants from '../constants'
import telemetry from '../telemetry'
import blessed from '../blessed'
import {RoleLabel, SpawnOrder} from '../types'

const creepRequired = {} as {[str: string]:Function}

creepRequired.harvester = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('harvester'),
    source: terrain.findSources(roomName).length
  }

  return {
    role: 'harvester',
    expected: counts.source,
    youngCount: counts.young,
    isRequired: counts.young < counts.source
  }
}

creepRequired.upgrader = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('upgrader')
  }

  const expected = 3

  return {
    role: 'upgrader',
    expected,
    youngCount: counts.young,
    isRequired: counts.young < 3
  }
}

creepRequired.transferer = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('upgrader'),
    containers: structures.container.findAll(roomName),
    towers: structures.tower.findAll(roomName)
  }

  const expected = 1 + Math.floor(counts.containers.length + (counts.towers.length / 4))
  return {
    role: 'transferer',
    expected,
    youngCount: counts.young,
    isRequired: counts.young < expected
  }
}

creepRequired.builder = (roomName:string):SpawnOrder => {
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

  return {
    role: 'builder',
    expected,
    youngCount: counts.young,
    isRequired: counts.young < expected
  }
}

creepRequired.scribe = (roomName:string):SpawnOrder => {
  const room = Game.rooms[roomName]
  const counts = {
    young: creeps.countYoungCreeps('builder')
  }

  const isRequired = counts.young === 0 && room.controller.sign.text !== constants.sign

  return {
    role: 'scribe',
    youngCount: counts.young,
    expected: isRequired ? 1: 0,
    isRequired
  }
}

const spawns = {} as {[str: string]:Function}

const priorities = [
  'upgrader',
  'harvester',
  'transferer',
  'builder',
  'scribe'
] as Array<RoleLabel>

const createCreep = (roomName:string, spawn:StructureSpawn, spawnOrder:SpawnOrder) => {
  const room = Game.rooms[roomName]

  const roomCapacity = room.energyAvailable

  const parts = creeps[spawnOrder.role].body(roomCapacity)
  const creepCost = creeps.getCost(parts)

  if (room.energyAvailable < creepCost) {
    return
  }

  const creepCode = spawn.createCreep(parts, creeps.pickCreepName(spawnOrder.role), {
    role: spawnOrder.role,
    spawnRoom: spawn.room.name
  })
}

const reportProgress = (roomName:string, spawn:StructureSpawn, spawnOrder:SpawnOrder):void => {
  if (Game.time % 5 !== 0) {
    return
  }

  const room = Game.rooms[roomName]
  const roomCapacity = room.energyAvailable

  const parts = creeps[spawnOrder.role].body(roomCapacity)
  const creepCost = creeps.getCost(parts)

  const message = `[ ${room.energyAvailable} / ${creepCost} towards ${spawnOrder.role} (${spawnOrder.youngCount} of ${spawnOrder.expected}) ]`

  console.log(blessed.blue(blessed.right(message)))
}

const spawner = (roomName:string, spawn:StructureSpawn):void => {
  for (const role of priorities) {
    const spawnOrder = creepRequired[role](roomName)
    if (spawnOrder.isRequired) {
      reportProgress(roomName, spawn, spawnOrder)
      createCreep(roomName, spawn, spawnOrder)
      break
    }
  }
}

export default {spawner}
