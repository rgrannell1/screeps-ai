
import misc from '../misc'
import {Plan, Point, Template, Bounds} from '../types'
import terrain from '../terrain'

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

Geometry.rotatePlan = (plan:Plan):Plan => {

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

Geometry.roomPositionMap = (roomName:string) => {
  const tiles = []

  for (let x = 0; x < 50; x++) {
    let row = []
    for (let y = 0; y < 50; y++) {
      row.push(new RoomPosition(x, y, roomName))
    }
    tiles.push(row)
  }

  return tiles
}

Geometry.terrainMap = (roomName:string) => {
  const terrainMask = new Room.Terrain(roomName)
  const tiles = []

  for (let x = 0; x < 50; x++) {
    let row = []
    for (let y = 0; y < 50; y++) {
      row.push(terrain.get(x, y))
    }
    tiles.push(row)
  }

  return tiles
}

Geometry.yieldLandBlocks = function* (filter:Function, roomName:string, dims:Point):IterableIterator<Bounds> {
  const tiles = Geometry.roomPositionMap(roomName).map(row => {
    return row.map(pos => {
      return {pos, isMatch: filter(pos)}
    })
  })

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

Geometry.yieldEmptyBlocks = Geometry.yieldLandBlocks.bind(null, terrain.is.plain)

Geometry.expandBounds = (roomName:string, bounds:Bounds):RoomPosition[] => {
  const tiles = []

  for (let ith = bounds.x0; ith < bounds.x1; ith++) {
    for (let jth = bounds.y0; jth < bounds.y1; jth++) {
      tiles.push(new RoomPosition(ith, jth, roomName))
    }
  }

  return tiles
}

Geometry.boundDistance = (pos:RoomPosition, bounds:Bounds):number => {
  const corners = [
    new RoomPosition(bounds.x0, bounds.y0, pos.roomName),
    new RoomPosition(bounds.x0, bounds.y1, pos.roomName),
    new RoomPosition(bounds.x1, bounds.y0, pos.roomName),
    new RoomPosition(bounds.x1, bounds.y1, pos.roomName)
  ]

  const pointDistances = corners
    .map(corner => {
      const xDiff = pos.x - corner.x
      const yDiff = pos.y - corner.y

      return {
        pos,
        corner,
        bounds,
        distance: Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
      }
    })
    .sort((data0, data1) => {
      return data1.distance - data0.distance
    })

  return pointDistances[0]
}

export default Geometry
