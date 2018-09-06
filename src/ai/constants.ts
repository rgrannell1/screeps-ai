
const constants = {} as any

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
    priority: 0,
    icon: 'H',
    plans: {
      standard: [CARRY, CARRY, WORK, MOVE]
    }
  },
  upgrader: {
    priority: 1,
    icon: 'U',
    plans: {
      standard: [CARRY, CARRY, WORK, MOVE, MOVE]
    }
  },
  defender: {
    priority: 2,
    icon: 'D',
    plans: {
      standard: [ATTACK, ATTACK, MOVE, MOVE, TOUGH, TOUGH]
    }
  },
  transferer: {
    priority: 3,
    icon: 'T',
    plans: {
      standard: [CARRY, CARRY, WORK, MOVE, MOVE]
    }
  },
  builder: {
    priority: 4,
    icon: 'B',
    plans: {
      standard: [CARRY, CARRY, WORK, MOVE, MOVE]
    }
  },
  repairer: {
    priority: 5,
    icon: 'R',
    plans: {
      standard: [CARRY, CARRY, WORK, MOVE, MOVE]
    }
  },
  scribe: {
    priority: 6,
    icon: 'S',
    plans: {
      standard: [WORK, MOVE, MOVE]
    }
  }
}

constants.whitelist = ['iamgqr']

constants.events = {
  tickWarning: 'tick_warning'
}

constants.limits = {
  events: 1e3
}

/*
  Information associated with each role's state
*/
constants.states ={
  ATTACKING: {
    code: '⚔'
  },
  BUILDING: {
    code: '👷'
  },
  SEEKING_SITE: {
    code: '🚚👷'
  },
  CHARGE: {
    code: '+⚡'
  },
  SEEKING_CHARGE: {
    code: '🚚⚡'
  },
  SEEKING_SOURCE: {
    code: '🚚⚡'
  },
  HARVEST: {
    code: '⛏'
  },
  SEEKING_ENEMY: {
    code: '🚚⚔'
  },
  SEEKING_SPAWN: {
    code: '🚚🏠'
  },
  SEEKING_CONTAINER: {
    code: '🚚📦'
  },
  SEEKING_EXTENSION: {
    code: '🚚📦'
  },
  DRAIN_CONTAINER: {
    code: '+⚡'
  },
  CHARGE_SPAWN: {
    code: '🏠⚡'
  },
  CHARGE_CONTAINER: {
    code: '📦⚡'
  },
  REPAIR: {
    code: '+❤'
  },
  SEEKING_DAMAGE: {
    code: '🚚❤'
  },
  SIGNING: {
    code: '✍'
  },
  DYING: {
    code: '💀'
  }
}

export default constants;
