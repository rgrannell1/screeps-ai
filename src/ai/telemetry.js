
const telemetry = {}

telemetry.recordCreepPosition = creep => {
  if (!Memory.creepPositionRecords) {
    Memory.creepPositionRecords = {}
  }

  const record = Memory.creepPositionRecords
  const {x, y} = creep.pos

  if (!record.hasOwnProperty(x)) {
    record[x] = {}
  }
  if (!record[x].hasOwnProperty(y)) {
    record[x][y] = 0
  }

  record[x][y]++
}

telemetry.emit = (label, data) => {
  if (!Memory.events) {
    Memory.events = []
  }

  if (Memory.events.length > 1000) {
    console.log('Too many events in queue!')
  } else {
    Memory.events.push({label, data})
  }
}

telemetry.on = label => {

}

module.exports = telemetry
