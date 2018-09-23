
const constants = {} as any

constants.labels = {
  exitRoads: 'exit_roads',
  miningRoads: 'mining_roads',
  ringRoads: 'ring_roads',
  extensionBlockOne: 'extension_block_one',
  extractors: 'extractors'
}

constants.sign = 'No uncaught exceptions in three days.'

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
  scout: {
    icon: 'S'
  },
  harvester: {
    icon: 'H'
  },
  miner: {
    icon: 'M'
  },
  exporter: {
    icon: 'E'
  },
  upgrader: {
    icon: 'U'
  },
  defender: {
    icon: 'D'
  },
  transferer: {
    icon: 'T'
  },
  builder: {
    icon: 'B'
  },
  repairer: {
    icon: 'R'
  },
  scribe: {
    icon: 'S'
  },
  claimer: {
    icon: 'C'
  }
}

constants.whitelist = ['iamgqr']

constants.events = {
  tickWarning: 'tick_warning'
}

constants.username = 'gooseThief'

constants.limits = {
  events: 8000,
  endOfYouth: 200,
  roomRecordInvalidTicks: 100
}

export default constants
