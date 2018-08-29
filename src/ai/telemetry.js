
const blessed = require('./blessed')
const constants = require('./constants')

const telemetry = {}

telemetry.emit = (label, data) => {
  if (!Memory.events || Memory.events.length > constants.limits.events) {
    Memory.events = []
  }
  Memory.events.push(Memory.event)
}

const listeners = {}

telemetry.on = (label, callback) => {
  listeners[label] = callback
}

telemetry.fire = () => {
  while (Memory.events.length > 0) {
    const event = Memory.events.pop()
    if (!event) {
      continue
    }
    let eventIngested = false
    for (const label of Object.keys(listeners)) {
      if (event.label === label) {
        listeners[label](event)
        eventIngested = true
      }
    }
    if (!eventIngested) {
      console.log(`${blessed.red('event not ingested!')} ${JSON.stringify(event)}`)
    }
  }
}

module.exports = telemetry
