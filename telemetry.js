
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

module.exports = telemetry
