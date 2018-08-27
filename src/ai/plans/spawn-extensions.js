

const constants = require('../constants')
const structures = require('../structures')
const terrain = require('../terrain')

const parts = {
  extension: {structure: STRUCTURE_EXTENSION},
  road: {structure: STRUCTURE_ROAD}
}

const rows = {
  mixed: new Array(3).fill(parts.extension)
    .concat([parts.road])
    .concat(new Array(3).fill(parts.extension)),
  road: new Array(7).fill(parts.road)
}

const flerp = () => {
  return new Array(3).fill(rows.mixed)
    .concat([rows.road])
    .concat(new Array(3).fill(rows.mixed))
}

const findEmptyBlock = (sum, bounds, roomName) => {
  const ySums = new Array(bounds.y.upper - bounds.y.lower).fill(0)

  for (let y = bounds.y.lower; y < bounds.y.upper; y++) {
    for (let x = bounds.x.lower; x < bounds.x.upper; x++) {
      // update the column's "y" sum for this row if present.
      ySums[x] = terrain.is.plain(new RoomPosition(x, y, roomName))
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
  return
  const block = findEmptyBlock(7, {
    x: {lower: 0, upper: 50},
    y: {lower: 0, upper: 50}
  }, roomName)

  console.log(JSON.stringify(block))
}

module.exports = spawnExtensions
