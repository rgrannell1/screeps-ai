
import {BuildingPlan} from '../types'
import terrain from '../terrain'
import interactive from '../interactive'
import constants from '../constants'
import {Site, Plan, BuildingPlans} from '../types'

const Architecture = {} as any

Architecture.addPlan = (plan:BuildingPlan) => {
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

Architecture.placePlans = () => {
  let buildingPlans:BuildingPlans

  if (!Memory.buildingPlans) {
    Memory.buildingPlans = {}
  }

  buildingPlans = Memory.buildingPlans

  for (const [roomName, plans] of Object.entries(buildingPlans)) {
    for (const plan of Object.values(plans)) {
      const room = Game.rooms[plan.roomName]
      for (const site of plan.sites) {
        const pos:RoomPosition = new RoomPosition(site.pos.x, site.pos.y, site.pos.roomName)
        const type:StructureConstant = site.type

        const atSite:LookAtResult<LookConstant>[] = pos.look()
        const isWall = atSite.some(val => val.terrain === 'wall')
        //const hasPart = atSite.some(val => val.structure === type)

        if (!isWall) {
          room.createConstructionSite(site.pos, site.type)
        }
      }
    }
  }
}

Architecture.showPlan = (plan:BuildingPlan) => {
  for (const site of plan.sites) {
    interactive.visualise(plan.roomName, site.type, site.pos)
  }
}

Architecture.showPlans = () => {
  let buildingPlans:BuildingPlans

  if (!Memory.buildingPlans) {
    Memory.buildingPlans = {}
  }

  buildingPlans = Memory.buildingPlans

  for (const [roomName, plans] of Object.entries(buildingPlans)) {
    for (const plan of Object.values(plans)) {
      Architecture.showPlan(plan)
    }
  }
}

export default Architecture
