
import blessed from './blessed'
import constants from './constants'
import logger from './logger'
import misc from './misc'
import {censusCreeps} from './spawner'

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

  if (Memory.events.length > 100 * 1000) {
    console.log('too full!')
    Memory.events = []
  }
}

telemetry.logGameState = (roomName:string) => {
  const room = Game.rooms[roomName]

  logger.data('room_state', 'room_state', {
    room_name: roomName,
    energy_available: room.energyAvailable,
    energy_capacity_available: room.energyCapacityAvailable,
    creep_count: Object.keys(Game.creeps).length,
    role_counts: censusCreeps(room)
  })
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



