
import {BuildingPlan} from '../types'
import terrain from '../terrain'
import interactive from '../interactive'
import constants from '../constants'
import {Site, Plan} from '../types'

const Architecture = {} as any

Architecture.addPlan = (plan:BuildingPlan) => {
  if (!Memory.buildingPlans) {
    Memory.buildingPlans = {}
  }

  if (!Memory.buildingPlans[plan.roomName]) {
    Memory.buildingPlans[plan.roomName] = {}
  }

  if (!Memory.buildingPlans[plan.roomName][plan.label]) {
    Memory.buildingPlans[plan.roomName][plan.label] = plan
  }
}

Architecture.placePlans = () => {
  if (!Memory.buildingPlans) {
    Memory.buildingPlans = {} as {
      [K0:string]: {
        [K1:string]: Plan
      }
    }
  }

  for (const [roomName, plans] of Object.entries(Memory.buildingPlans)) {
    for (const plan of Object.values(plans)) {
      const room = Game.rooms[plan.roomName]
      for (const site of plan.sites) {

        const atSite:LookAtResult<LookConstant>[] = site.pos.look()
        const isWall = atSite.some(val => val.terrain === 'wall')
        const hasPart = atSite.some(val => val.structure === site.type)

        if (!isWall && !hasPart) {
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
  for (const [roomName, plans] of Object.entries(Memory.buildingPlans)) {
    for (const plan of Object.values(plans)) {
      Architecture.showPlan(plan)
    }
  }
}

export default Architecture
