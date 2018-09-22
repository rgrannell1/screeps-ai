
import {} from '../types'
import terrain from '../terrain'

const Cartography = {} as any

Cartography.recordRoom = (roomName:string) => {
  if (!Memory.cartography) {
    Memory.cartography = {}
  }

  const controller = terrain.findController

  Memory.cartography[roomName] = {
    sourceCount: terrain.findSources(roomName),
    hasOwner: !!controller.owner
  }

  // -- get minerals
  // -- get controller status
  // -- get creeps present
  // -- egt structures present

}

export default Cartography
