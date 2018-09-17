
import constants from './constants'
import {Priority, RoleLabel} from './types'

const creeps = {} as any

creeps.exists = (roleName, roomName, count = 1) => {
  const room = Game.rooms[roomName]

  return room.find(FIND_CREEPS).filter(creep => {
    creep.memory.roleName === roleName
  }).length >= count
}

creeps.countYoungCreeps = (role:RoleLabel) => {
  return Object.values(Game.creeps).filter(creep => {
    return creep.memory.role === role && creep.ticksToLive > constants.limits.endOfYouth
  }).length
}

creeps.pickCreepName = (role:string) => {
  if (!Memory.roles) {
    Memory.roles = {}
  }

  if (Memory.roles.hasOwnProperty(role) && Memory.roles[role].hasOwnProperty('count')) {
    Memory.roles[role].count++
  } else {
    Memory.roles[role] = {count: 0}
  }

  return `${constants.roles[role].icon}-${Memory.roles[role].count}`
}

creeps.getCost = (parts:string[]):number => {
  return parts.reduce((sum, part) => sum + constants.costs[part], 0)
}

creeps.findTargetEnemy = (creepName:string) => {
  const creep = Game.creeps[creepName]
  const nearbyHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
    filter (creep) {
      return !constants.whitelist.includes(creep.owner.username.toLowerCase())
    }
  })

  return nearbyHostile
}

const createBodyPlan = (initial, extension, capacity) => {
  const currentCost = creeps.getCost(initial)

  const upperLimit = Math.max(300, capacity / 2)

  let parts = initial
  while (true) {
    let proposed = extension

    if (creeps.getCost(parts.concat(proposed)) < upperLimit) {
      parts = parts.concat(proposed)
    } else {
      break
    }
  }

  return parts
}

creeps.roles = {}

creeps.harvester = {}

creeps.harvester.body = (capacity:number) => {
  return createBodyPlan([CARRY, CARRY, WORK, MOVE], [WORK, CARRY, MOVE], capacity)
}

creeps.upgrader = {}

creeps.upgrader.body = (capacity:number) => {
  return createBodyPlan([CARRY, CARRY, WORK, MOVE, MOVE], [WORK, CARRY, MOVE], capacity)
}

creeps.defender = {}

creeps.defender.body = (capacity:number) => {
  return [ATTACK, ATTACK, MOVE, MOVE, TOUGH, TOUGH]
}

creeps.transferer = {}

creeps.transferer.body = (capacity:number) => {
  return createBodyPlan([CARRY, CARRY, WORK, MOVE, MOVE], [CARRY, CARRY, MOVE], capacity)
}

creeps.builder = {}

creeps.builder.body = (capacity:number) => {
  return createBodyPlan([CARRY, CARRY, WORK, MOVE, MOVE], [CARRY, CARRY, MOVE], capacity)
}

creeps.repairer = {}

creeps.repairer.body = (capacity:number) => {
  return createBodyPlan([CARRY, CARRY, WORK, MOVE, MOVE], [CARRY, CARRY, MOVE], capacity)
}

creeps.scribe = {}

creeps.scribe.body = (capacity:number) => {
  return [WORK, MOVE, MOVE]
}

creeps.claimer = {}

creeps.claimer.body = (capacity:number) => {
  return [MOVE, TOUGH, TOUGH, TOUGH]
}

const hasPriority = (transferers, priority) => {
  return transferers.some(([_, data]) => data.memory.sinkPriority === priority)
}

creeps.chooseEnergySink = (creep:Creep, priorityLists:Array<Priority>):Priority => {
  if (priorityLists.length === 0) {
    throw new Error('priority lists must be provided')
  }

  let priorities = null
  if (creep.memory.sinkPriority) {
    priorities = priorityLists.find(list => list.label === creep.memory.sinkPriority)
  } else {
    const others = Object.entries(Game.creeps)
      .filter(([name, data]) => {
        return data.memory.role === creep.memory.role && name !== creep.name
      })

    for (const data of priorityLists) {
      if (!hasPriority(others, data.label)) {
        priorities = priorityLists.find(list => list.label === data.label)
        creep.memory.sinkPriority = data.label
        break
      }
    }

    if (!priorities) {
      creep.memory.sinkPriority = priorityLists[0].label
      priorities = priorityLists.find(list => list.label === creep.memory.sinkPriority)
    }
  }

  if (!priorities) {
    throw new Error(`no priorities yielded from ${JSON.stringify(priorityLists)}`)
  }

  return priorities
}


creeps.findExitPath = (creep:Creep, roomName) => {
  const exitDir = creep.room.findExitTo(roomName)
  return creep.pos.findClosestByRange(<any>exitDir)
}

export default creeps
