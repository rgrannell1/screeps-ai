
import misc from '../misc'
import {Plan, Point, Template, Bounds} from '../types'
import terrain from '../terrain'

const Geometry = {} as any

Geometry.template = (template:Template):Template => {
  return template
}

Geometry.plan = (template:Template, pos:RoomPosition):Plan[] => {
  const sites:Plan[] = []

  // -- todo fix typeerror
  template.forEach((row, ith) => {
    return row.forEach((type, jth) => {
      sites.push({
        type,
        pos: new RoomPosition(pos.x + ith, pos.y + jth, pos.roomName)
      })
    })
  })

  return sites
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

Geometry.roomPositionMap = (roomName:string) => {
  const tiles:Array<Array<RoomPosition>> = []

  for (let x = 0; x < 50; x++) {
    let row:RoomPosition[] = []
    for (let y = 0; y < 50; y++) {
      row.push(new RoomPosition(x, y, roomName))
    }
    tiles.push(row)
  }

  return tiles
}

Geometry.terrainMap = (roomName:string):number[][] => {
  const terrainMask = new Room.Terrain(roomName)
  const tiles:RoomPosition[] = []

  for (let x = 0; x < 50; x++) {
    let row:number[] = []
    for (let y = 0; y < 50; y++) {
      row.push(terrain.get(x, y))
    }
    tiles.push(row)
  }

  return tiles
}

Geometry.yieldPlots = function* (filter:Function, roomName:string, dims:Point):IterableIterator<Bounds> {
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

Geometry.yieldEmptyPlots = Geometry.yieldPlots.bind(null, terrain.is.plain)

Geometry.yieldEmptyZonedPlots = Geometry.yieldPlots.bind(null, (pos:RoomPosition) => {
  let zones = []

  Object.values(Game.spawns).map(spawn => {
    if (spawn.room.name === pos.roomName) {
      zones = zones.concat(Geometry.border(spawn.pos, 2))
    }
  })

  const isPlain = terrain.is.plain(pos)
  const notReserved = !Geometry.includesPosition(pos, zones)

  return isPlain && notReserved
})

Geometry.expandBounds = (roomName:string, bounds:Bounds):RoomPosition[] => {
  const tiles:RoomPosition[] = []

  for (let ith = bounds.x0; ith < bounds.x1; ith++) {
    for (let jth = bounds.y0; jth < bounds.y1; jth++) {
      tiles.push(new RoomPosition(ith, jth, roomName))
    }
  }

  return tiles
}

Geometry.boundDistance = (pos:RoomPosition, bounds:Bounds):number => {
  const room = Game.rooms[pos.roomName]

  const corners = [
    new RoomPosition(bounds.x0, bounds.y0, pos.roomName),
    new RoomPosition(bounds.x0, bounds.y1, pos.roomName),
    new RoomPosition(bounds.x1, bounds.y0, pos.roomName),
    new RoomPosition(bounds.x1, bounds.y1, pos.roomName)
  ]

  const pointDistances = corners.map(corner => {
    const path = room.findPath(corner, pos)

    return path.length === 0 ? Infinity : path.length
  })

  return Math.min(...pointDistances)
}

Geometry.border = (pos:RoomPosition, radius:number):RoomPosition[] => {
  const bounds = {
    x0: Math.max(0, pos.x - radius),
    x1: Math.min(pos.x + radius, 49),
    y0: Math.max(0, pos.y - radius),
    y1: Math.min(pos.y + radius, 49)
  }

  return Geometry.expandBounds(pos.roomName, bounds)
}

Geometry.includesPosition = (pos:RoomPosition, range:RoomPosition[]):boolean => {
  return range.some(candidate => {
    return candidate.x === pos.x && candidate.y === pos.y && candidate.roomName === pos.roomName
  })
}

export default Geometry
