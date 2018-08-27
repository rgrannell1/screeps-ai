
const constants = {}

constants.labels = {
  exitRoads: 'exit_roads',
  miningRoads: 'mining_roads',
  ringRoads: 'ring_roads',
  extensionBlockOne: 'extension_block_one'
}

constants.sign = 'No intelligent life detected.'

constants.costs = {
  move: 50,
  work: 100,
  carry: 50,
  attack: 80,
  ranged_attack: 150,
  heal: 250,
  tough: 10,
  claim: 600
}

constants.roles = {
  harvester: {
    icon: 'H',
    plans: {
      standard: [CARRY, CARRY, WORK, MOVE]
    }
  },
  upgrader: {
    icon: 'U',
    plans: {
      standard: [CARRY, CARRY, WORK, MOVE, MOVE]
    }
  },
  transferer: {
    icon: 'T',
    plans: {
      standard: [CARRY, CARRY, WORK, MOVE, MOVE]
    }
  },
  builder: {
    icon: 'B',
    plans: {
      standard: [CARRY, WORK, MOVE, MOVE]
    }
  },
  repairer: {
    icon: 'R',
    plans: {
      standard: [CARRY, CARRY, WORK, MOVE, MOVE]
    }
  },
  scribe: {
    icon: 'S',
    plans: {
      standard: [WORK, MOVE, MOVE]
    }
  }
}

constants.events = {
  tickWarning: 'tick_warning'
}

constants.limits = {
  events: 1e3
}

module.exports = constants
