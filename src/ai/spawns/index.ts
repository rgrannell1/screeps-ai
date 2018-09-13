
import creeps from '../creeps'
import terrain from '../terrain'
import structures from '../structures'
import constants from '../constants'

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

const spawner = (roomName:string):void => {
  const expected = []
  for (const  [role, notEnough] of Object.entries(creepRequired)) {
    const shouldBuild = notEnough(roomName)
    if (shouldBuild) {
      expected.push([role, shouldBuild])
    }
  }

  console.log(JSON.stringify(expected, null, 2))
}

export default {spawner}
