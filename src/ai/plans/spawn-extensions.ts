
import misc from '../misc'
import terrain from '../terrain'
import structures from '../structures'
import templates from '../templates'
import constants from '../constants'
import interactive from '../interactive'
import * as Architecture from '../modules/architecture'
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
    console.log(`${state[ref]} running`)
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

    Architecture.placePlans()

  } catch (err) {
    console.log(`failed to place plans with minDist:${JSON.stringify(minDist, null, 2)}`)
    throw err
  }
}

const zoneExtensionBlock = (roomName:string, count:number):void => {
  const areasRef = `area_result_acc_${count}`

  // -- use a shared area yielder.
  const areasRefCompute = `area_result_acc_compute`

  if (!state[areasRef]) {
    state[areasRef] = []
  }

  const sortAccRef = `sort_result_acc_${count}`
  const sortAccComputeRef = `sort_result_acc_compute_${count}`
  if (!state[sortAccRef]) {
    state[sortAccRef] = []
  }

  const emptyPlotRef = `empty_plot_${count}`

  if (!state[emptyPlotRef]) {
    state[emptyPlotRef] = Geometry.yieldEmptyZonedPlots(roomName, {x: 3, y: 3})
  }

  const emptyAreas = Compute.evaluate(state[emptyPlotRef], state[areasRef], 50)

  if (emptyAreas) {
    startEmptyZoneComputation(roomName, areasRefCompute, state[areasRef])

    const areasWithDistances = Compute.evaluate(state[areasRefCompute], state[sortAccRef], 50)
    if (areasWithDistances && areasWithDistances.length > 0) {
      placeExtensionBlock(roomName, count, areasWithDistances)
    }
  }
}

const extensionsByLevel = [0, 5, 10, 20, 30, 40, 50, 60]
const EXTENSION_COUNT_PER_BLOCK = 9

const spawnExtensions = (roomName:string):void => {
  const room = Game.rooms[roomName]

  if (!room.controller || roomName !== 'W42N31') {
    return
  }

  const level = room.controller.level

  const extensionsAllowed = extensionsByLevel[Math.min(level, 8)]
  const requiredBlocks = Math.floor(extensionsAllowed / EXTENSION_COUNT_PER_BLOCK)

  for (let blockId = 0; blockId < requiredBlocks; blockId++) {
    zoneExtensionBlock(roomName, blockId)
  }
}

export default spawnExtensions
