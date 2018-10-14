
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

/*
## startEmptyZoneComputation

Create a generator that computes the distance from each empty block of
land to the controller.
*/
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

/*
## placeExtensionBlock

find the ideal block of land for the extensions. Place roads leading to this block and the extensions themselves
*/
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

/*
## zoneExtensionBlock

Compute
*/
const zoneExtensionBlock = (roomName:string, count:number):void => {
  const refs = {
    areas: `area_result_acc_${count}`,
    areaCompute: `area_result_acc_compute`,
    sortAcc: `sort_result_acc_${count}`,
    emptyPlot: `empty_plot_${count}`
  }

  // -- results will be pushed to these references.
  for (const ref of [refs.areas, refs.sortAcc]) {
    state[ref] = []
  }

  // -- yield 3 x 3 empty blocks to build on.
  if (!state[refs.emptyPlot]) {
    state[refs.emptyPlot] = Geometry.yieldEmptyZonedPlots(roomName, {x: 3, y: 3})
  }

  // -- slowly yield empty plots.
  const emptyPlots = Compute.evaluate({
    computation: state[refs.emptyPlot],
    storage: state[refs.areas],
    by: constants.BATCH_SIZE
  })

  if (emptyPlots) {
    // -- compute the distances between each block and the controller.
    startEmptyZoneComputation(roomName, refs.areaCompute, state[refs.areas])

    // -- slowly yield empty plots.
    const areasWithDistances = Compute.evaluate({
      computation: state[refs.areaCompute],
      storage: state[refs.sortAcc],
      by: constants.BATCH_SIZE
    })

    if (areasWithDistances && areasWithDistances.length > 0) {
      placeExtensionBlock(roomName, count, areasWithDistances)
    }
  }
}

const spawnExtensions = (roomName:string):void => {
  const room = Game.rooms[roomName]

  if (!room.controller) {
    return
  }

  if (roomName !== 'W42N31') {
    return
  }

  const level = room.controller.level

  const extensionsAllowed = constants.extensionsByLevel[Math.min(level, 8)]
  const requiredBlocks = Math.floor(extensionsAllowed / constants.EXTENSION_COUNT_PER_BLOCK)

  for (let blockId = 0; blockId < requiredBlocks; blockId++) {
    zoneExtensionBlock(roomName, blockId)
  }
}

export default spawnExtensions
