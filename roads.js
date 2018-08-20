
const roads = {}

roads.build = ({room, source, target, roomName}) => {
  const roadPath = room.findPath(source, target, {
    ignoreCreeps: true,
    ignoreRoads: true
  })

  for (const {x, y} of roadPath) {
    const pos = new RoomPosition(x, y, roomName)
    pos.createConstructionSite(STRUCTURE_ROAD)
  }
}

roads.plan = roomName => {
  const room = Game.rooms[roomName]
  const sources = room.find(FIND_SOURCES)
  const spawns = Game.spawns

  for (const name of Object.keys(spawns)) {
    const spawn = spawns[name]

    for (const source of sources) {
      const sharedOpts = {
        room,
        roomName,
        target: source.pos
      }

      roads.build({...sharedOpts, source: spawn.pos})
      roads.build({...sharedOpts, source: room.controller.pos})
    }
  }
}

roads.repair = creep => {
  const roads = creep.room.find(FIND_STRUCTURES, {
    filter (object) {
      return object.structureType === STRUCTURE_ROAD && (object.hits < (object.hitsMax / 4))
    }
  })

  if (creep.repair(roadToRepair) === ERR_NOT_IN_RANGE) {
    creep.moveTo(roadToRepair);
  }
}

module.exports = roads
