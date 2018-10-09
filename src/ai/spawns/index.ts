
import creeps from '../creeps'
import terrain from '../terrain'
import structures from '../structures'
import constants from '../constants'
import telemetry from '../telemetry'
import blessed from '../blessed'
import * as Cartography from '../modules/cartography'
import * as Architecture from '../modules/architecture'
import {RoleLabel, SpawnOrder} from '../types'

const creepRequired = {} as {[str: string]:Function}

creepRequired.exporter = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('exporter', roomName),
    source: terrain.findSources(roomName).length
  }

  const expected = 0

  return {
    role: 'exporter',
    expected,
    youngCount: counts.young,
    sufficientCount: 0,
    isRequired: counts.young < counts.source
  }
}

creepRequired.scout = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('scout', roomName)
  }

  const expected = Cartography.findUnchartedNeighbours(roomName).length === 0
    ? 0
    : 1

  return {
    role: 'scout',
    expected,
    youngCount: counts.young,
    sufficientCount: expected,
    isRequired: counts.young < expected
  }
}

creepRequired.claimer = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('claimer', roomName)
  }

  const expected = !Game.rooms.hasOwnProperty('W41N31') || !Game.rooms.W41N31.controller.owner
    ? 1
    : 0

  return {
    role: 'claimer',
    expected,
    youngCount: counts.young,
    sufficientCount: expected,
    isRequired: counts.young < expected
  }
}

creepRequired.harvester = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('harvester', roomName),
    source: terrain.findSources(roomName).length
  }

  return {
    role: 'harvester',
    expected: 2 * counts.source,
    youngCount: counts.young,
    sufficientCount: 2 * counts.source,
    isRequired: counts.young < counts.source
  }
}

creepRequired.miner = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('miner', roomName),
    minerals: terrain.findMinerals(roomName).length
  }

  const roomLevel = Game.rooms[roomName].controller.level

  // check if extractors present

  const expected = roomLevel >= 6 && counts.minerals > 0
    ? counts.minerals
    : 0

  return {
    role: 'miner',
    expected: counts.minerals,
    youngCount: counts.young,
    sufficientCount: 1,
    isRequired: counts.young < counts.minerals
  }
}


creepRequired.upgrader = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('upgrader', roomName)
  }

  const expected = 2

  return {
    role: 'upgrader',
    expected,
    youngCount: counts.young,
    sufficientCount: 2,
    isRequired: counts.young < expected
  }
}

creepRequired.repairer = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('repairer', roomName)
  }

  const expected = 1

  return {
    role: 'repairer',
    expected,
    youngCount: counts.young,
    sufficientCount: 1,
    isRequired: counts.young < expected
  }
}

creepRequired.transferer = (roomName:string):SpawnOrder => {
  const counts = {
    young: creeps.countYoungCreeps('transferer', roomName),
    containers: structures.container.findAll(roomName),
    towers: structures.tower.findAll(roomName)
  }

  const expected = Math.floor(counts.containers.length + (counts.towers.length / 4))
  return {
    role: 'transferer',
    expected,
    youngCount: counts.young,
    sufficientCount: 1,
    isRequired: counts.young < expected
  }
}

creepRequired.builder = (roomName:string):SpawnOrder => {
  const room = Game.rooms[roomName]
  const counts = {
    young: creeps.countYoungCreeps('builder', roomName)
  }

  const SITE_TO_BUILDER_RATIO = 15
  const ENERGY_TO_BUILDER_RATIO = 50000

  const sites = room.find(FIND_CONSTRUCTION_SITES).filter(item => {
    return Architecture.isTunnel(item)
  })
  const siteCount = sites.length
  const totalRequiredEnergy = sites
    .reduce((sum, site) => sum + (site.progressTotal - site.progress), 0) || 0

  let expected = 0

  if (sites) {
    expected = Math.max(
      0,
      Math.ceil(siteCount / SITE_TO_BUILDER_RATIO),
      Math.ceil(totalRequiredEnergy / ENERGY_TO_BUILDER_RATIO)
    )
    expected = Math.min(expected, 3)
  }

  return {
    role: 'builder',
    expected,
    youngCount: counts.young,
    sufficientCount: 1,
    isRequired: counts.young < expected
  }
}

creepRequired.scribe = (roomName:string):SpawnOrder => {
  const room = Game.rooms[roomName]
  const counts = {
    young: creeps.countYoungCreeps('scribe', roomName)
  }

  const isRequired = counts.young === 0 && room.controller && room.controller.sign.text !== constants.sign

  return {
    role: 'scribe',
    youngCount: counts.young,
    sufficientCount: 1,
    expected: isRequired ? 1: 0,
    isRequired
  }
}

const spawns = {} as {[str: string]:Function}

// -- todo; reorder.
const priorities = [
  'upgrader',
  'harvester',
  'transferer',
  'exporter',
  'claimer',
  'repairer',
  'builder',
  'scout',
  'miner',
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

  const creepName = creeps.pickCreepName(spawnOrder.role)
  const creepCode = spawn.createCreep(parts, creepName, {
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
  const missingRole = priorities.find(role => {
    const spawnOrder = creepRequired[role](roomName)
    return spawnOrder.isRequired && spawnOrder.youngCount < spawnOrder.sufficientCount
  })

  let queued = missingRole
    ? creepRequired[missingRole](roomName)
    : null

  if (!queued) {
    for (const role of priorities) {
      const spawnOrder = creepRequired[role](roomName)
      if (spawnOrder.isRequired) {
        queued = spawnOrder
        break
      }
    }
  }

  if (queued) {
    //reportProgress(roomName, spawn, queued)
    createCreep(roomName, spawn, queued)
  }
}

export default {spawner}
