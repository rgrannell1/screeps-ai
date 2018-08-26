

const constants = require('../constants')
const structures = require('../structures')

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

const spawnExtensions = roomName => {
  const roads = terrain.findRoads(roomName)
}

module.exports = spawnExtensions
