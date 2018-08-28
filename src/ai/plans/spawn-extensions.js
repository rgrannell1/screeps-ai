

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

  for (ith = 0; ith < midPoint; ith++) {
    let left = block.x.lower + ith
    let right = block.x.upper - ith
    let top = block.y.upper - ith
    let bottom = block.x.lower + ith

    if (ith === midPoint && !isEven) {
      points.push(new RoomPosition(left, top, roomName))
    } else {
      points.push(new RoomPosition(left, top, roomName))
      points.push(new RoomPosition(right, top, roomName))
      points.push(new RoomPosition(left, bottom, roomName))
      points.push(new RoomPosition(right, bottom, roomName))
    }
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

  return

  return
  createExtensionBlock(block, roomName)
    .forEach(({pos, plan}) => {
      structures.any.place(pos, plan.structures.structure, {label: 'extension_block_one'})
    })
}

module.exports = spawnExtensions
