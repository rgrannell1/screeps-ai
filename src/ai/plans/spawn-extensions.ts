
import misc from '../misc'
import terrain from '../terrain'
import structures from '../structures'
import templates from '../templates'
import constants from '../constants'
import interactive from '../interactive'
import Architecture from '../modules/architecture'
import Geometry from '../modules/geometry'
import Compute from '../modules/compute'
import {Bounds} from '../types'

const state = {} as any

type posBoundDistance = {
  readonly pos: RoomPosition,
  readonly bounds: Bounds,
  readonly distance: number
}

function startEmptyZoneComputation (roomName:string, emptyAreas):void {
  const controller = terrain.findController(roomName)

  if (!state.distanceToControllerResult) {
    state.distanceToControllerResult = Compute.map(emptyAreas, (area:Bounds):posBoundDistance => {
      try {
        return {
          pos: controller.pos,
          bounds: area,
          distance: Geometry.boundDistance(controller.pos, area)
        }
      } catch (err) {
        throw new Error(err.message + '\n' + JSON.stringify(area))
      }
    })
  }
}

function placeExtensionBlock (roomName:string, count:number, areasWithDistances:posBoundDistance[]):void {
   const controller = terrain.findController(roomName)

  const minDist = areasWithDistances.reduce((acc, current) => {
    return current.distance < acc.distance ? current : acc
  })

  try {
    const topLeft = new RoomPosition(minDist.bounds.x0, minDist.bounds.y0, roomName)
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

    Architecture.addPlan({roomName, label: `extensions_link_${count}`, sites: roadSites})
    Architecture.addPlan({roomName, label: `extensions_${count}`, sites})

    Architecture.placePlans()

  } catch (err) {
    console.log(JSON.stringify(minDist, null, 2))
    throw err
  }
}

const zoneExtensionBlock = (roomName:string, count:number):void => {
  if (!state.result) {
    state.result = Geometry.yieldEmptyZonedPlots(roomName, {x: 3, y: 3})
  }

  const resultAccRef = `result_acc_${count}`
  if (!state[resultAccRef]) {
    state[resultAccRef] = []
  }

  const sortAccRef = `result_acc_${count}`
  if (!state[sortAccRef]) {
    state[sortAccRef] = []
  }

  const emptyAreas = Compute.evaluate(state.result, state[resultAccRef], 400)

  if (emptyAreas) {
    startEmptyZoneComputation(roomName, emptyAreas)

    const areasWithDistances = Compute.evaluate(state.distanceToControllerResult, state[sortAccRef], 300)
    if (areasWithDistances) {
      placeExtensionBlock(roomName, count, areasWithDistances)
    }
  }
}

const spawnExtensions = (roomName:string):void => {
  const room = Game.rooms[roomName]

  if (roomName !== 'W42N31') {
    return
  }

  zoneExtensionBlock(roomName, 0)
  zoneExtensionBlock(roomName, 1)
}

export default spawnExtensions
