
const constants = require('./constants')

const tower = {}

tower.run = roomName => {
  const towers = structures.tower.findAll(roomName)

  for (const tower of towers) {
    const nearbyHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
      filter (creep) {
        return !constants.whitelist.includes(creep.owner.username.toLowerCase())
      }
    })

    if (nearbyHostile) {
      tower.attack(nearbyHostile)
    }
  }
}

module.exports = tower
