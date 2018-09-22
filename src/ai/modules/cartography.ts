
import {} from '../types'
import terrain from '../terrain'
import constants from '../constants'

const Cartography = {} as any

Cartography.recordRoom = (roomName:string) => {
  if (!Memory.cartography) {
    Memory.cartography = {}
  }

  if (!Memory.cartography[roomName] || Game.time - Memory.cartography[roomName] > constants.limits.roomRecordInvalidTicks) {

    const controller = terrain.findController(roomName)

    Memory.cartography[roomName] = {
      sourceCount: terrain.findSources(roomName).length,
      mineralCount: terrain.findMinerals(roomName).length,
      tenant: {
        hasOwner: !!controller.owner,
        isMine: controller.owner && controller.owner.username === constants.username,
        hostileCreepCount: terrain.findHostiles(roomName).length
      },
      time: Game.time
    }
  }
}

Cartography.findNeighbours = (roomName:string) => {
  return Object.values(Game.map.describeExits(roomName))
}

Cartography.findUnchartedNeighbours = (roomName:string) => {
  return Object.values(Game.map.describeExits(roomName)).filter(name => {
    return Memory.cartograph.hasOwnProperty(name)
  })
}

export default Cartography
