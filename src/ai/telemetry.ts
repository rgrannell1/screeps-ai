
import blessed from './blessed'
import constants from './constants'
import structures from './structures'
import creeps from './creeps'
import logger from './logger'
import misc from './misc'

const telemetry = {} as any

telemetry.emit = (label:string, data:object) => {
  if (!Memory.events || Memory.events.length > constants.limits.events) {
    Memory.events = []
  }
  Memory.events.push({
    label,
    data,
    time: Date.now()
  })

  if (Memory.events.length > constants.limits.events) {
    console.log('too full!')
    Memory.events = []
  }
}

telemetry.logGameState = (roomName:string) => {
  const room = Game.rooms[roomName]
  const towers = structures.tower.findAll(roomName)
  const containers = structures.container.findAll(roomName)
  const controller = Game.rooms[roomName].controller

  const roomState = {
    room_name: roomName,
    energy_available: room.energyAvailable,
    energy_capacity_available: room.energyCapacityAvailable,
    creep_energy: Object.values(Game.creeps).reduce((acc, creep) => acc + creep.carry.energy, 0),
    rcl: {
      level: controller.level,
      progress: controller.progress,
      progress_total: controller.progressTotal,
      progress_total_pct: controller.progress / controller.progressTotal
    },
    gcl: {
      level: Game.gcl.level,
      progress: Game.gcl.progress,
      progress_total: Game.gcl.progressTotal,
      progress_total_pct: Game.gcl.progress / Game.gcl.progressTotal,
    },
    cpu: {
      limit: Game.cpu.getUsed()
    },
    towers: {
      available: towers.reduce((sum, current) => sum + current.energy, 0),
      capacity: towers.reduce((sum, current) => sum + current.energyCapacity, 0)
    },
    containers: {
      available: containers.reduce((sum, current) => sum + current.store.energy, 0),
      capacity: containers.reduce((sum, current) => sum + current.store.energyCapacity, 0)
    },
    creep_count: Object.keys(Game.creeps).length
  } as any

  roomState.creep_body_costs = Object.values(Game.creeps)
    .reduce((sum, creep) => {
      const parts = creep.body.map(part => part.type)
      return sum + creeps.getCost(parts)
    }, 0)

  logger.data('room_state', 'room_state', roomState)
}


telemetry.moveCode = (code:number):string => {
  const codes = [
    [OK, 'OK'],
    [ERR_NOT_OWNER, 'ERR_NOT_OWNER'],
    [ERR_NO_PATH, 'ERR_NO_PATH'],
    [ERR_BUSY, 'ERR_BUSY'],
    [ERR_INVALID_TARGET, 'ERR_INVALID_TARGET'],
    [ERR_TIRED, 'ERR_TIRED'],
    [ERR_NO_BODYPART, 'ERR_NO_BODYPART'],
  ] as Array<[number, string]>

  for (const [candidateCode, description] of codes) {
    if (candidateCode === code) {
      return description
    }
  }

  return `unknown code ${code}`
}

telemetry.withdrawCode = (code:number):string => {
  const codes = [
    [OK,'OK'],
    [ERR_NOT_OWNER,'ERR_NOT_OWNER'],
    [ERR_BUSY,'ERR_BUSY'],
    [ERR_NOT_ENOUGH_RESOURCES,'ERR_NOT_ENOUGH_RESOURCES'],
    [ERR_INVALID_TARGET,'ERR_INVALID_TARGET'],
    [ERR_FULL,'ERR_FULL'],
    [ERR_NOT_IN_RANGE,'ERR_NOT_IN_RANGE'],
    [ERR_INVALID_ARGS,'ERR_INVALID_ARGS']
  ] as Array<[number, string]>

  for (const [candidateCode, description] of codes) {
    if (candidateCode === code) {
      return description
    }
  }

  return `unknown code ${code}`
}

telemetry.transferCode = (code:number):string => {
  const codes = [
    [OK,'OK'],
    [ERR_NOT_OWNER,'ERR_NOT_OWNER'],
    [ERR_BUSY,'ERR_BUSY'],
    [ERR_NOT_ENOUGH_RESOURCES,'ERR_NOT_ENOUGH_RESOURCES'],
    [ERR_INVALID_TARGET,'ERR_INVALID_TARGET'],
    [ERR_FULL,'ERR_FULL'],
    [ERR_NOT_IN_RANGE,'ERR_NOT_IN_RANGE'],
    [ERR_INVALID_ARGS,'ERR_INVALID_ARGS']
  ] as Array<[number, string]>

  for (const [candidateCode, description] of codes) {
    if (candidateCode === code) {
      return description
    }
  }

  return `unknown code ${code}`
}

export default telemetry



