
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

function startEmptyZoneComputation (roomName:string, ref:string, emptyAreas):void {
  const controller = terrain.findController(roomName)

  if (!state[ref]) {
    state[ref] = Compute.map(emptyAreas, (area:Bounds):posBoundDistance => {
      return {
        pos: controller.pos,
        bounds: area,
        distance: Geometry.boundDistance(controller.pos, area)
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

    Architecture.showPlans()
    Architecture.placePlans()

  } catch (err) {
    console.log(`failed to place plans with minDist:${JSON.stringify(minDist, null, 2)}`)
    throw err
  }
}

const zoneExtensionBlock = (roomName:string, count:number):void => {
  if (!state.emptyZonedPlotsCompute) {
    state.emptyZonedPlotsCompute = Geometry.yieldEmptyZonedPlots(roomName, {x: 3, y: 3})
  }

  const areasRef = `area_result_acc_${count}`
  const areasRefCompute = `area_result_acc_compute_${count}`

  if (!state[areasRef]) {
    state[areasRef] = []
  }

  const sortAccRef = `sort_result_acc_${count}`
  const sortAccComputeRef = `sort_result_acc_compute_${count}`
  if (!state[sortAccRef]) {
    state[sortAccRef] = []
  }

  const emptyAreas = Compute.evaluate(state.emptyZonedPlotsCompute, state[areasRef], 400)

  if (emptyAreas) {
    startEmptyZoneComputation(roomName, areasRefCompute, state[areasRef])

    const areasWithDistances = Compute.evaluate(state[areasRefCompute], state[sortAccRef], 300)
    if (areasWithDistances && areasWithDistances.length > 0) {
      placeExtensionBlock(roomName, count, areasWithDistances)
    } else {
      console.log('deferred')
    }
  }
}

const spawnExtensions = (roomName:string):void => {
  const room = Game.rooms[roomName]

  if (!room.controller) {
    return
  }

  const level = room.controller.level

  if (roomName !== 'W42N31') {
    return
  }

  // -- CONTROLLER_STRUCTURES

  if (level >= 2) {
    zoneExtensionBlock(roomName, 0)
  }

  if (level >= 3) {
    zoneExtensionBlock(roomName, 1)
  }

  if (level >= 4) {
    zoneExtensionBlock(roomName, 2)
  }

  if (level >= 5) {
    zoneExtensionBlock(roomName, 3)
  }

  if (level >= 6) {
    zoneExtensionBlock(roomName, 4)
  }

  if (level >= 7) {
    zoneExtensionBlock(roomName, 5)
  }
}

export default spawnExtensions
