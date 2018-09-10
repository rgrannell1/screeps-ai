
import misc from './misc'
import structures from './structures'
import constants from './constants'
import {Tower} from './types'

const run = (roomName:string) => {
  const towers = structures.tower.findAll(roomName)

  for (const tower of towers) {
    const nearbyHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
      filter (creep) {
        return !constants.whitelist.includes(creep.owner.username.toLowerCase())
      }
    })

    const canRepair = tower.energy > 0.5 * tower.energyCapacity

    if (nearbyHostile) {
      misc.match(tower.attack(nearbyHostile), {
        [OK] () {},
        default (val) {
          console.log(`tower attack ${val}`)
        }
      })
    } else if (canRepair && !nearbyHostile) {
      const damaged = structures.findDamagedStructure(roomName, [
        STRUCTURE_CONTAINER,
        STRUCTURE_ROAD,
        STRUCTURE_WALL,
        STRUCTURE_RAMPART
      ])

      if (!damaged) {
        return
      }

      misc.match(tower.repair(damaged), {
        [OK] () {},
        [ERR_INVALID_TARGET] () {
          console.log(`bad target selected for repair: ${JSON.stringify(damaged)}`)
        },
        default (val) {
          console.log(`tower repair ${val}`)
        }
      })
    }
  }
}

export default <Tower>{run}
