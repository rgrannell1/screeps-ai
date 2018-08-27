

const constants = require('../constants')
const structures = require('../structures')
const terrain = require('../terrain')

const parts = {
  extension: {structure: STRUCTURE_EXTENSION},
  road: {structure: STRUCTURE_ROAD}
}

const createExtensionBlock = (bounds, roomName) => {
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

const findEmptyBlock = (sum, bounds, pred, roomName) => {
  const ySums = new Array(bounds.y.upper - bounds.y.lower).fill(0)

  for (let y = bounds.y.lower; y < bounds.y.upper; y++) {
    for (let x = bounds.x.lower; x < bounds.x.upper; x++) {
      // update the column's "y" sum for this row if present.
      ySums[x] = pred(new RoomPosition(x, y, roomName))
        ? ySums[x] + 1
        : 0
    }
    // -- this needs support for non-zero bounds.
    let xSum = 0
    for (let x = 0; x < ySums.length; x++) {
      // check there's a stretch of sufficiently tall columns
      xSum = ySums[x] >= sum ? xSum + 1 : 0
      if (xSum === sum) {
        return {
          x: {lower: x - sum, upper: x},
          y: {lower: y - sum, upper: y}
        }
      }
    }
  }
}

const spawnExtensions = roomName => {
  if (structures.planExists(constants.labels.extensionBlockOne)) {
    return
  }

  const tileCheck = tile => {
    return terrain.is.plain(tile)
  }
  const block = findEmptyBlock(7, {
    x: {lower: 0, upper: 50},
    y: {lower: 0, upper: 50}
  }, tileCheck, roomName)

  createExtensionBlock(block, roomName)
    .forEach(({pos, plan}) => {
      structures.any.place(pos, plan.structures.structure, {label: 'extension_block_one'})
    })
}

module.exports = spawnExtensions
