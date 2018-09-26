
import {BuildingPlan} from '../types'
import terrain from '../terrain'
import interactive from '../interactive'
import constants from '../constants'

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
    Memory.buildingPlans = {}
  }

  for (const [roomName, plans] of Object.entries(Memory.buildingPlans)) {
    for (const plan of Object.values(plans)) {
      const room = Game.rooms[plan.roomName]

      try {
        for (const site of plan.sites) {
          room.createConstructionSite(site.pos, site.type)
        }
      } catch (err) {
        console.log(`failed to place construction-site:\n${JSON.stringify(plan, null, 2)}\n${err.message}`)
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
