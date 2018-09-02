
const misc = require('./misc')
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

    const canRepair = tower.energy > 0.2 * tower.energyCapacity

    if (nearbyHostile) {
      misc.switch(tower.attack(nearbyHostile), {
        [OK] () {},
        default (val) {
          console.log(`tower attack ${val}`)
        }
      })
    } else if (canRepair && !nearbyHostile) {
      const damaged = structures.findDamagedStructure(roomName, ['containers', 'roads'])

      misc.switch(tower.repair(damaged), {
        [OK] () {},
        default (val) {
          console.log(`tower repair ${val}`)
        }
      })
    }
  }
}

module.exports = tower
