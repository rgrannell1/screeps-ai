
import {Plan, Point, Template} from '../types'

const Geometry = {} as any

Geometry.template = (template:Template):Template => {
  return template
}

Geometry.plan = (template:Template, pos:RoomPosition):Plan => {
  return template.map((row, ith) => {
    return row.map((type, jth) => {
      return {
        type,
        pos: new RoomPosition(pos.x + ith, pos.y + jth, pos.roomName)
      }
    })
  })
}

Geometry.translate = (parts:Plan, point:Point):Plan => {
  return parts.map(row => {
    return row.map(({type, pos}) => {
      return {
        type,
        pos: new RoomPosition(pos.x + point.x, pos.y + point.y, pos.roomName)
      }
    })
  })
}

Geometry.map = (roomName:string):Array<LookForAtAreaResultWithPos<Terrain, "terrain"> => {
  return Game.rooms[roomName].lookForAtArea(LOOK_TERRAIN, 0, 0, 49, 49, true)
}

Geometry.listBlocks = function* (roomName:string) {
  const tiles = []
  for (let x = 0; x < 50; x++) {
    let row = []
    for (let y = 0; y < 50; y++) {
      row.push(new RoomPosition(x, y, roomName))
    }
    tiles.push(row)
  }
}

export default Geometry
