
import terrain from '../terrain';
import constants from '../constants';
import structures from '../structures';

const miningRoads = roomName => {
  const room = Game.rooms[roomName]

  if (structures.planExists(constants.labels.miningRoads)) {
    return
  }

  const minerals = terrain.findMinerals(roomName)

  const sources = terrain.findSources(roomName)
  const spawns = terrain.findSpawns(roomName)
  const controller = terrain.findController(roomName)

  const targets = sources.concat(spawns).concat([controller])
  const metadata = {label: constants.labels.miningRoads}

  for (const name of Object.keys(minerals)) {
    const mineral = minerals[name]

    for (const entity of targets) {
      structures.highway.place({room, source: mineral.pos, target: entity.pos}, metadata)
      structures.highway.place({room, source: mineral.pos, target: entity.pos}, metadata)
      structures.highway.place({room, source: mineral.pos, target: entity.pos}, metadata)
    }
  }
}

export default miningRoads;
