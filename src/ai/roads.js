
const roads = {}

roads.build = ({room, source, target}) => {
  const roadPath = room.findPath(source, target, {
    ignoreCreeps: true,
    ignoreRoads: true
  })

  for (const {x, y} of roadPath) {
    const pos = new RoomPosition(x, y, room.name)
    pos.createConstructionSite(STRUCTURE_ROAD)
  }
}

roads.repair = creep => {
  const [road] = creep.room.find(FIND_STRUCTURES, {
    filter (object) {
      return object.structureType === STRUCTURE_ROAD && (object.hits < (object.hitsMax / 2))
    }
  })

  if (creep.repair(road) === ERR_NOT_IN_RANGE) {
    creep.moveTo(road)
  }
}

module.exports = roads
