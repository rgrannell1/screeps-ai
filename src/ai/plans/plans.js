
const roads = require('../roads')
const misc = require('../misc')

const plans = {}

plans.ringRoads = roomName => {
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

plans.sourceContainers = roomName => {
  const room = Game.rooms[roomName]
  const sources = room.find(FIND_SOURCES)

  for (const source of sources) {
    const pos = source.pos

    if (!Memory[source.id]) {
      Memory[source.id] = {}
    }

    if (Memory[source.id].hasContainer) {
      continue
    }

    const tiles = misc.nearbyEmptyTiles(pos, {dist: 2,  roomName})
    const candidates = tiles
      .filter(tile => {
        return room.lookAt(tile).some(entry => entry.terrain === 'wall')
      })
      .map(tile => {
        return {
          tile,
          pathLength: room.findPath(pos, tile).length
        }
      })
      .sort((tile0, tile1) => {
        return tile0.pathLength - tile1.pathLength
      })

    for (const {title} of candidates) {
      const createCode = pos.createConstructionSite(STRUCTURE_CONTAINER)
      const created = misc.switch(createCode, {
        [OK] () {
          Memory[source.id].hasContainer = true    
          return true
        }
      })

      if (created) {
        break
      }
    }

    console.log(`not created? WHY?`)

  }
}

module.exports = plans
