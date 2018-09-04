
const blessed = require('./blessed')
const constants = require('./constants')
const {censusCreeps} = require('./spawner')

const telemetry = {}

telemetry.emit = (label, data) => {
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

telemetry.logGameState = roomName => {
  const room = Game.rooms[roomName]

  telemetry.emit('room_state', {
    room_name: roomName,
    energy_available: room.energyAvailable,
    energy_capacity_available: room.energyCapacityAvailable,
    creep_count: Object.keys(Game.creeps).length,
    role_counts: censusCreeps(room)
  })
}

module.exports = telemetry
