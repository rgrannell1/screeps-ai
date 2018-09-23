
import {BuildingPlan} from '../types'
import terrain from '../terrain'
import constants from '../constants'

const Architecture = {} as any

Architecture.addPlan = (plan:BuildingPlan) => {
  if (!Memory.buildingPlans) {
    Memory.buildingPlans = {}
  }

  Memory.buildingPlans[plan.label] = plan
}

Architecture.placePlan = () => {
  if (!Memory.buildingPlans) {
    Memory.buildingPlans = {}
  }


}

export default Architecture
