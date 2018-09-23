
import misc from '../misc'
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

Geometry.yieldLandBlocks = function* (roomName:string, dims:Point, pred:Function):Bounds {
  const tiles = []

  // -- check if things match
  for (let x = 0; x < 50; x++) {
    let row = []
    for (let y = 0; y < 50; y++) {
      const pos = new RoomPosition(x, y, roomName)
      row.push({
        pos,
        isMatch: pred(pos)
      })
    }
    tiles.push(row)
  }

  for (let ith = 0; ith < (49 - dims.x); ith++) {
    for (let jth = 0; jth < (49 - dims.y); jth++) {

      // -- check if all intervening blocks match.
      const isMatchingBlock = misc.indicesTo(ith, ith + dims.x).every(x => {
        return misc.indicesTo(jth, jth + dims.y).every(y => {
          return tiles[x][y].isMatch
        })
      })

      // -- yield matching blocks
      if (isMatchingBlock) {
        yield {
          x0: ith,
          x1: ith + dims.x,
          y0: jth,
          y1: jth + dims.y,
        }
      }
    }
  }
}

Geometry.expandBounds = (roomName:string, bounds:Bounds):RoomPosition[] => {
  const tiles = []

  for (let ith = bounds.x0; ith < bounds.x1; ith++) {
    for (let jth = bounds.y0; jth < bounds.y1; jth++) {
      tiles.push(new RoomPosition(ith, jth, roomName))
    }
  }

  return tiles
}

export default Geometry
