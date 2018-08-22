
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
        roomName
      }

      roads.build({...sharedOpts, source: spawn.pos, target: source.pos})
      roads.build({...sharedOpts, source: room.controller.pos, target: source.pos})
      roads.build({...sharedOpts, source: room.controller.pos, target: spawn.pos})
    }
  }
}

roads.repair = creep => {
  const [road] = creep.room.find(FIND_STRUCTURES, {
    filter (object) {
      return object.structureType === STRUCTURE_ROAD && (object.hits < (object.hitsMax / 2))
    }
  })

  if (creep.repair(road) === ERR_NOT_IN_RANGE) {
    creep.moveTo(road);
  }
}

module.exports = roads
