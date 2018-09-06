

import constants from '../constants';
import structures from '../structures';
import terrain from '../terrain';

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
  const points = []

  for (let ith = block.x.lower; ith < block.x.upper; ith++) {
    for (let jth = block.y.lower; jth < block.y.upper; jth++) {


    }
  }
}

const spawnExtensions = roomName => {
  if (structures.planExists(constants.labels.extensionBlockOne)) {
    return
  }
return
  const tileCheck = tile => {
    return terrain.is.plain(tile)
  }

  block = terrain.findMatchingBlock(4, {
    x: {lower: 0, upper: 50},
    y: {lower: 0, upper: 50}
  }, tileCheck, roomName)

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

export default spawnExtensions;
