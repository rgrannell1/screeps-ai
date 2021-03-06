
import constants from './constants'
import {Priority, RoleLabel} from './types'

const creeps = {} as any

creeps.exists = (roleName:string, roomName:string, count:number = 1) => {
  const room = Game.rooms[roomName]

  return room.find(FIND_CREEPS).filter(creep => {
    creep.memory.roleName === roleName
  }).length >= count
}

/*
  F = 2 * (W * K - M)

  Where:
      F = initial fatigue value
      W = creep weight (Number of body parts, excluding MOVE and empty CARRY parts)
      K = terrain factor (0.5x for road, 1x for plain, 5x for swamp)
      M = number of MOVE parts
*/
creeps.estimateRequiredMoveParts = (parts:string[]):number => {
  return Math.ceil(parts.length / 2)
}

creeps.countYoungCreeps = (role:RoleLabel, roomName:string) => {
  return Object.values(Game.creeps).filter(creep => {
    const isRole = creep.memory && creep.memory.role === role
    const isYoung = creep.ticksToLive
      ? creep.ticksToLive > constants.limits.endOfYouth
      : false
    const inRoom = creep.room.name === roomName

    return isRole && isYoung && inRoom
  }).length
}

creeps.pickCreepName = (role:string):string => {
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

// -- todo needs refactoring.
const createBodyPlan = (initial:string[], extension:string[], capacity:number) => {
  const currentCost = creeps.getCost(initial)

  const ADJUSTMENT_FACTOR = 1
  const upperLimit = Math.max(300, ADJUSTMENT_FACTOR * capacity)

  let parts = initial
  while (true) {
    let proposed = extension

    if (creeps.getCost(parts.concat(proposed)) < upperLimit) {
      parts = parts.concat(proposed)
    } else {
      break
    }
  }

  return parts.sort()
}

creeps.roles = {}

creeps.harvester = {}

creeps.harvester.body = (capacity:number):string[] => {
  return createBodyPlan([CARRY, MOVE, MOVE, WORK], [WORK], capacity)
}

creeps.miner = {}

creeps.miner.body = (capacity:number):string[] => {
  return createBodyPlan([CARRY, MOVE, MOVE, WORK], [WORK], capacity)
}

creeps.scout = {}

creeps.scout.body = (capacity:number):string[] => {
  return [MOVE]
}

creeps.exporter = {}

creeps.exporter.body = (capacity:number):string[] => {
  return [CARRY, CARRY, CARRY, MOVE, MOVE, WORK]
}

creeps.upgrader = {}

creeps.upgrader.body = (capacity:number):string[] => {
  return createBodyPlan([CARRY, CARRY, WORK, MOVE, MOVE], [WORK, CARRY, MOVE], capacity)
}

creeps.transferer = {}

creeps.transferer.body = (capacity:number):string[] => {
  // -- four carries for container.
  return createBodyPlan([CARRY, CARRY, MOVE, MOVE], [CARRY, CARRY, MOVE], capacity)
}

creeps.builder = {}

creeps.builder.body = (capacity:number):string[] => {
  return createBodyPlan([CARRY, CARRY, WORK, MOVE, MOVE], [CARRY, CARRY, MOVE], capacity)
}

creeps.repairer = {}

creeps.repairer.body = (capacity:number):string[] => {
  return createBodyPlan([CARRY, CARRY, WORK, MOVE, MOVE], [CARRY, CARRY, MOVE], capacity)
}

creeps.scribe = {}

creeps.scribe.body = (capacity:number):string[] => {
  return [WORK, MOVE, MOVE]
}

creeps.claimer = {}

creeps.claimer.body = (capacity:number):string[] => {
  return [MOVE, CLAIM]
}

const hasPriority = (transferers:Array<any>, priority:string):boolean => {
  return transferers.some(([_, data]) => data.memory.sinkPriority === priority)
}

creeps.chooseEnergySink = (creep:Creep, priorityLists:Priority[]):Priority => {
  if (priorityLists.length === 0) {
    throw new Error('priority lists must be provided')
  }

  let priorities
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

creeps.findExitPath = (creep:Creep, roomName:string):any => {
  const exitDir = creep.room.findExitTo(roomName)
  return creep.pos.findClosestByRange(<any>exitDir)
}

creeps.carrying = (creep:Creep):number => {
  const stored = Object.values(creep.carry) as number[]
  return stored.reduce((acc, current) => acc + current, 0)
}

creeps.id = (creep:Creep):number => {
  return Memory.roles[creep.memory.role].count
}

export default creeps
