
const roads = require('../roads')
const terrain = require('../terrain')
const structures = require('../structures')

const exitRoads = roomName => {
  const room = Game.rooms[roomName]

  const exits = terrain.getExitTiles(roomName)
  const state = {
    groups: []
  }

  const targets = [
    exits.find(exit => exit.x === 0),
    exits.find(exit => exit.x === 49),
    exits.find(exit => exit.y === 0),
    exits.find(exit => exit.y === 49)
  ].filter(exit => exit != null)

  const metadata = {label: 'exit_roads'}
  const controller = terrain.findController(roomName)
  for (target of targets) {
    structures.highway.place({room, source: controller.pos, target: target}, metadata)
  }
}

module.exports = exitRoads
