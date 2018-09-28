
import constants from '../constants'
import terrain from '../terrain'
import structures from '../structures'
import Cartography from '../modules/cartography'

const exitRoads = (roomName:string):void => {
  const room = Game.rooms[roomName]

  if (structures.planExists(constants.labels.exitRoads)) {
    return
  }

  const neighbours:string[] = Cartography.findNeighbours(roomName)
  const classifications = neighbours.map(Cartography.classify)
  const targets = classifications.filter(data => {
    return data.safety !== 'hostile' && (data.sourceCount > 0 || data.mineralCount > 0)
  })

  const controller = terrain.findController(roomName)
  const metadata = {label: constants.labels.exitRoads}

  const exits = terrain.getExitTiles(roomName)
  for (const target of targets) {
    const route = Game.map.findRoute(roomName, target.roomName)
    const [targetDirection] = route

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

    structures.highway.place({
      room,
      source: controller.pos,
      target: exitTile
    }, metadata)
  }
}

export default exitRoads
