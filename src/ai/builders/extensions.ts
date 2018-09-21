
import {Infrastructure} from '../types'
import Geometry from '../modules/geometry'

const template = Geometry.template([
  [STRUCTURE_EXTENSION, STRUCTURE_EXTENSION, STRUCTURE_EXTENSION],
  [STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_EXTENSION],
  [STRUCTURE_EXTENSION, STRUCTURE_EXTENSION, STRUCTURE_ROAD]
])

const plan = (roomName:string) => {
  const room = Game.rooms[roomName]




}

export default <Infrastructure>{plan}
