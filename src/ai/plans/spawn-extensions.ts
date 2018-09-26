
import misc from '../misc'
import terrain from '../terrain'
import structures from '../structures'
import templates from '../templates'
import constants from '../constants'
import interactive from '../interactive'
import Architecture from '../modules/architecture'
import Geometry from '../modules/geometry'
import Compute from '../modules/compute'

const state = {
  resultAcc: [],
  sortAcc: []
} as any

const merp = (roomName:string, count:number):void => {
  if (!state.result) {
    state.result = Geometry.yieldEmptyZonedPlots(roomName, {x: 3, y: 3})
  }

  let emptyAreas = Compute.evaluate(state.result, state.resultAcc, 400)

  if (emptyAreas) {
    const controller = terrain.findController(roomName)

    if (!state.distanceToControllerResult) {
      state.distanceToControllerResult = Compute.map(emptyAreas, area => {
        return {
          pos: controller.pos,
          bounds: area,
          distance: Geometry.boundDistance(controller.pos, area)
        }
      })
    }

    let areasWithDistances = Compute.evaluate(state.distanceToControllerResult, state.sortAcc, 300)
    if (areasWithDistances) {
      const {bounds} = areasWithDistances.reduce((acc, current) => {
        return current.distance < acc.distance ? current : acc
      })

      const topLeft = new RoomPosition(bounds.x0, bounds.y0, roomName)
      const sites = Geometry.plan(templates.extensions(), topLeft)

      const roadPath = Game.rooms[roomName].findPath(topLeft, controller.pos, {
        ignoreCreeps: true,
        ignoreRoads: false
      })

      const roadSites = roadPath.map(data => {
        return {
          pos: new RoomPosition(data.x, data.y, roomName),
          type: STRUCTURE_ROAD
        }
      })

      Architecture.addPlan({
        roomName,
        label: `extensions_link_${count}`,
        sites: roadSites
      })

      Architecture.addPlan({
        roomName,
        label: `extensions_${count}`,
        sites
      })

      //Architecture.placePlans()
    }
  }
}

const spawnExtensions = (roomName:string):void => {
  const room = Game.rooms[roomName]

  if (roomName !== 'W42N31') {
    return
  }

  merp(roomName, 0)
}

export default spawnExtensions
