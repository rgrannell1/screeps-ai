
import {BuildingPlan} from '../types'
import terrain from '../terrain'
import interactive from '../interactive'
import conhasstants from '../constants'
import {Site, Plan, BuildingPlans} from '../types'

export const hasPlan = (roomName:string, label:string):boolean => {
  if (!Memory.buildingPlans) {
    Memory.buildingPlans = {}
  }

  return label in Memory.buildingPlans[roomName]
}

export const addPlan = (plan:BuildingPlan) => {
  let buildingPlans:BuildingPlans

  if (!Memory.buildingPlans) {
    Memory.buildingPlans = {}
  }

  buildingPlans = Memory.buildingPlans

  if (!buildingPlans[plan.roomName]) {
    buildingPlans[plan.roomName] = {}
  }

  if (!buildingPlans[plan.roomName][plan.label]) {
    buildingPlans[plan.roomName][plan.label] = plan
  }
}

export const placePlan = (room:Room, site) => {
  const pos:RoomPosition = new RoomPosition(site.pos.x, site.pos.y, site.pos.roomName)
  const type:StructureConstant = site.type

  const atSite:LookAtResult<LookConstant>[] = pos.look()
  const isWall = atSite.some(val => val.terrain === 'wall')

  if (!isWall) {
    const code = room.createConstructionSite(site.pos.x, site.pos.y, site.type)

    if (code === ERR_INVALID_ARGS) {
      console.log('invalid arguments ' + JSON.stringify(site, null, 2))
    }

    return {site, code}
  }
}

function groupConstructionResults (results) {
  const grouped = results.reduce((acc, current) => {
    if (!current) {
      return acc
    }

    if (!acc.codes) {
      acc.codes = {}
    }
    if (!acc.codes.hasOwnProperty(current.code)) {
      acc.codes[current.code] = []
    }

    acc.codes[current.code].push(current.site)
    return acc
  }, {})

  return grouped
}

export const placePlans = () => {
  let buildingPlans:BuildingPlans

  if (!Memory.buildingPlans) {
    Memory.buildingPlans = {}
  }

  buildingPlans = Memory.buildingPlans

  for (const [roomName, plans] of Object.entries(buildingPlans)) {
    for (const plan of Object.values(plans)) {
      const room = Game.rooms[plan.roomName]

      const planResults = plan.sites.map(site => placePlan(room, site))
    }
  }
}

export const showPlan = (plan:BuildingPlan):void => {
  for (const site of plan.sites) {
    interactive.visualise(plan.roomName, site.type, site.pos)
  }
}

export const showPlans = () => {
  let buildingPlans:BuildingPlans

  if (!Memory.buildingPlans) {
    Memory.buildingPlans = {}
  }

  buildingPlans = Memory.buildingPlans

  for (const [roomName, plans] of Object.entries(buildingPlans)) {
    for (const plan of Object.values(plans)) {
      showPlan(plan)
    }
  }
}

/*
Is the supplied construction-site a tunnel?

@return A boolean indicating whether the site is a tunnel.
*/
export const isTunnel = (site:ConstructionSite):boolean => {
  return site.structureType === STRUCTURE_ROAD && site.progressTotal === 45000
}
/*
Is the supplied construction-site a tunnel?

> Bing bong

*/
export const findBuildingSite = (roomName:string, siteTypes:BuildableStructureConstant[]):ConstructionSite => {
  const sites = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES)

  for (const siteType of siteTypes) {
    let candidate = sites.find(site => {
      return site.structureType === siteType && !isTunnel(site)
    })

    if (candidate) {
      return candidate
    }
  }

  return sites[0]
}
