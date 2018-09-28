
import {} from '../types'
import terrain from '../terrain'
import constants from '../constants'

const Cartography = {} as any

Cartography.recordRoom = (roomName:string):void => {
  if (!Memory.cartography) {
    Memory.cartography = {}
  }

  if (!Memory.cartography[roomName] || Game.time - Memory.cartography[roomName] > constants.limits.roomRecordInvalidTicks) {

    const controller = terrain.findController(roomName)

    Memory.cartography[roomName] = {
      sourceCount: terrain.findSources(roomName).length,
      mineralCount: terrain.findMinerals(roomName).length,
      tenant: {
        hasOwner: !!(controller && controller.owner),
        isMine: controller && controller.owner
          ? controller.owner && controller.owner.username === constants.username
          : false,
        hostileCreepCount: terrain.findHostiles(roomName).length
      },
      time: Game.time
    }
  }
}

Cartography.findNeighbours = (roomName:string):string[] => {
  if (!Memory.cartography) {
    Memory.cartography = {}
  }

  const exits = Game.map.describeExits(roomName)

  return Array.isArray(exits)
    ? Object.values(exits)
    : []
}

Cartography.findUnchartedNeighbours = (roomName:string):string[] => {
  if (!Memory.cartography) {
    Memory.cartography = {}
  }

  return Cartography.findNeighbours(roomName).filter(name => {
    return !Memory.cartography.hasOwnProperty(name)
  })
}

Cartography.classify = (roomName:string):object => {
  if (!Memory.cartography) {
    throw new Error('no sites present')
  }

  const observations = Memory.cartography[roomName]

  const summary = {
    roomName,
    sourceCount: observations.sourceCount,
    mineralCount: observations.mineralCount,
  } as any

  if (!observations) {
    summary.type = 'unknown'
    return summary
  }

  const hasOwner = observations.tenant.hasOwner
  const isMine = observations.tenant.isMine
  const containsHostiles = observations.tenant.hostileCreepCount > 0

  if (hasOwner && !isMine || !isMine && containsHostiles) {
    summary.safety = 'hostile'
  } else if (!hasOwner && !containsHostiles) {
    summary.safety = 'neutral'
  } else if (isMine) {
    summary.safety = 'friendly'
  }

  return summary
}

Cartography.isSafe = (roomName:string):boolean => {
  return Cartography.classify(roomName).safety !== 'hostile'
}

export default Cartography
