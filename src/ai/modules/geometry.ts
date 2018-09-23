
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

Geometry.map = (roomName:string) => {
  return Game.rooms[roomName].lookForAtArea(LOOK_TERRAIN, 0, 0, 49, 49, true)
}

function isMatchingLandBlock (tiles, ith:number, jth:number, dims:Point) {
  return misc.indicesTo(ith, ith + dims.x).every(x => {
    return misc.indicesTo(jth, jth + dims.y).every(y => tiles[x][y].isMatch)
  })
}

Geometry.yieldLandBlocks = function* (pred:Function, roomName:string, dims:Point):Bounds {
  // -- check if things match

  const tiles = misc.indicesTo(0, 49).map(x => {
    return misc.indicesTo(0, 49).map(y => {
      const pos = new RoomPosition(x, y, roomName)
      return {
        pos,
        isMatch: pred(pos)
      }
     })
  })

  for (const ith of misc.indicesTo(0, 49 - dims.x)) {
    for (const jth of misc.indicesTo(0, 49 - dims.x)) {

       // -- simplifiy
      if (isMatchingLandBlock(tiles, ith, jth, dims)) {
        let result = {
          x0: ith,
          x1: ith + dims.x,
          y0: jth,
          y1: jth + dims.y,
        }
        yield result
      }

    }
  }
}

Geometry.yieldEmptyBlocks = Geometry.yieldLandBlocks.bind(null, pos => {
  const observation = pos.look()

  if (observation.length !== 1) {
    return false
  }

  return observation[0].terrain === 'plain'
})

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
