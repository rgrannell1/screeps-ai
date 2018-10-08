
import {} from '../types'
import terrain from '../terrain'
import constants from '../constants'

export const recordRoom = (roomName:string):void => {
  if (!Memory.cartography) {
    Memory.cartography = {}
  }

  if (!Memory.cartography[roomName] || Game.time - Memory.cartography[roomName] > constants.limits.roomRecordInvalidTicks) {

    const controller = terrain.findController(roomName)

    Memory.cartography[roomName] = {
      sourceCount: terrain.findSources(roomName).length,
      mineralCount: terrain.findMinerals(roomName).length,
      tenant: {
        hasController: Game.rooms[roomName].hasOwnProperty('controller'),
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

export const findNeighbours = (roomName:string):string[] => {
  const exits = Game.map.describeExits(roomName)

  return !!exits
    ? Object.values(exits)
    : []
}

export const findBuildeableNeighbours = (roomName:string):string[] => {
  if (!Memory.cartography) {
    Memory.cartography = {}
  }

  const claimable:string[] = []
  const neighbours = findNeighbours(roomName)

  for (const neighbour of neighbours) {
    const obs = Memory.cartography[neighbour]

    if (!obs) {
      continue
    }

    const hasController = obs.tenant.hasController
    const hasHostiles = obs.tenant.hostileCreepCount > 0
    const isOurs = (obs.tenant.isMine || !obs.tenant.hasOwner)

    if (isOurs && hasController && !hasHostiles) {
      claimable.push(neighbour)
    }
  }

  return claimable
}

export const findUnchartedNeighbours = (roomName:string):string[] => {
  if (!Memory.cartography) {
    Memory.cartography = {}
  }

  return findNeighbours(roomName).filter(name => {
    return !Memory.cartography.hasOwnProperty(name)
  })
}

export const classify = (roomName:string):object => {
  if (!Memory.cartography) {
    throw new Error('no sites present')
  }

  const observations = Memory.cartography[roomName]

  if (!observations) {
    return {}
  }

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

export const isSafe = (roomName:string):boolean => {
  return classify(roomName).safety !== 'hostile'
}
