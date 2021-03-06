
const constants = {} as any

constants.labels = {
  exitRoads: 'exit_roads',
  miningRoads: 'mining_roads',
  ringRoads: 'ring_roads',
  extensionBlockOne: 'extension_block_one',
  extractors: 'extractors'
}

constants.sign = 'League of Automated Roombas'
constants.EXTENSION_COUNT_PER_BLOCK = 9
constants.BATCH_SIZE = 50

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

constants.extensionsByLevel = [0, 5, 10, 20, 30, 40, 50, 60]

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

constants.buildPriorities = [
  STRUCTURE_SPAWN,
  STRUCTURE_CONTAINER,
  STRUCTURE_LAB,
  STRUCTURE_LINK,
  STRUCTURE_EXTENSION,
  STRUCTURE_TOWER,
  STRUCTURE_STORAGE,
  STRUCTURE_RAMPART,
  STRUCTURE_ROAD,
  STRUCTURE_TERMINAL,
  STRUCTURE_NUKER,
  STRUCTURE_POWER_BANK,
  STRUCTURE_POWER_SPAWN,
]

constants.repairPriorities = [
  STRUCTURE_CONTAINER,
  STRUCTURE_RAMPART,
  STRUCTURE_ROAD,
  STRUCTURE_WALL
]

export default constants
