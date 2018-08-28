

const constants = require('../constants')
const structures = require('../structures')
const terrain = require('../terrain')

const parts = {
  extension: {structure: STRUCTURE_EXTENSION},
  road: {structure: STRUCTURE_ROAD}
}

const floop = (bounds, roomName) => {
  const xOffset = bounds.x.lower
  const yOffset = bounds.y.lower
  const size = 7

  const output = Array(size).fill(
    new Array(size).fill([])
  ).map((row, ith) => {
    return row.map((_, jth) => {
      let structure

      if (jth === 3) {
        structure = STRUCTURE_ROAD
      } else if (ith === 3) {
        structure = STRUCTURE_ROAD
      } else {
        structure = STRUCTURE_EXTENSION
      }

      return {
        pos: new RoomPosition(xOffset + ith, yOffset + jth, roomName),
        plan: {
          structures: {structure}
        }
      }
    })
  })

  return  [].concat.apply([], output)
}

const createExtensionBlock = (block, roomName) => {
  const midPoint = Math.ceil(block.dimension / 2)
  const isEven = block.dimension % 2 === 0
  let points = []

  let x0  = block.x.lower
  let x1 = block.x.upper - 1

  let y0  = block.y.lower
  let y1 = block.y.upper - 1

  const mdRoad = {structure: STRUCTURE_ROAD}
  const mdExt = {structure: STRUCTURE_EXTENSION}

  while (x1 >= block.x.lower) {
    points.push({pos: new RoomPosition(x0, y0, roomName), ...mdRoad})
    points.push({pos: new RoomPosition(x1, y0, roomName), ...mdRoad})
    points.push({pos: new RoomPosition(x0, y1, roomName), ...mdRoad})
    points.push({pos: new RoomPosition(x1, y1, roomName), ...mdRoad})

    if (x1 - x0 > 1) {
      points.push({pos: new RoomPosition(x0 + 1, y0, roomName), ...mdExt})
      points.push({pos: new RoomPosition(x0 - 1, y0, roomName), ...mdExt})
      points.push({pos: new RoomPosition(x1 + 1, y0, roomName), ...mdExt})
      points.push({pos: new RoomPosition(x0 - 1, y1, roomName), ...mdExt})
      points.push({pos: new RoomPosition(x1 + 1, y1, roomName), ...mdExt})
    }

    x0++, x1--, y0++, y1--
  }

  return points
}

const spawnExtensions = roomName => {
  if (structures.planExists(constants.labels.extensionBlockOne)) {
    return
  }
return
  const tileCheck = tile => {
    return terrain.is.plain(tile)
  }

  let block
  for (let size = 14; size > 8; size--) {
    block = terrain.findMatchingBlock(size, {
      x: {lower: 0, upper: 50},
      y: {lower: 0, upper: 50}
    }, tileCheck, roomName)

    if (block) {
      block.dimension = size
      break
    }
  }

  const xx = createExtensionBlock(block, roomName)

  xx.forEach((pos, ith) => {
    if (pos.structure === STRUCTURE_ROAD) {
      pos.pos.createFlag(`${ith}`, COLOR_GREY)
    } else {
      pos.pos.createFlag(`${ith}`, COLOR_GREEN)
    }
  })


return
  createExtensionBlock(block, roomName)
    .forEach(({pos, plan}) => {
      //structures.any.place(pos, plan.structures.structure, {label: 'extension_block_one'})
    })
}

module.exports = spawnExtensions
