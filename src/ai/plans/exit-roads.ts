
import constants from '../constants'
import terrain from '../terrain'
import structures from '../structures'
import Cartography from '../modules/cartography'

const exitRoads = (roomName:string) => {
  const room = Game.rooms[roomName]

  if (structures.planExists(constants.labels.exitRoads)) {
    return
  }

  const neighbours = Cartography.findNeighbours(roomName)
  const classifications = neighbours.map(Cartography.classify)
  const targets = classifications.filter(data => {
    return data.safety !== 'hostile' && (data.sourceCount > 0 || data.mineralCount > 0)
  })

  const controller = terrain.findController(roomName)
  const metadata = {label: constants.labels.exitRoads}

  for (const target of targets) {
    const [targetDirection] = Game.map.findRoute(roomName, target.roomName)
    const exits = terrain.getExitTiles(roomName)

    let exitTile
    if (targetDirection.exit === FIND_EXIT_TOP) {
      exitTile = exits.find(exit => exit.y === 0)
    } else if (targetDirection.exit === FIND_EXIT_RIGHT) {
      exitTile = exits.find(exit => exit.x === 49)
    } else if (targetDirection.exit === FIND_EXIT_BOTTOM) {
      exitTile = exits.find(exit => exit.y === 49)
    } else if (targetDirection.exit === FIND_EXIT_LEFT) {
      exitTile = exits.find(exit => exit.x === 0)
    }
    structures.highway.place({room, source: controller.pos, target: exitTile}, metadata)
  }
}

export default exitRoads
