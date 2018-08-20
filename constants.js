
const constants = {
  pathStyles: {
    harvestSource: '#FF69B4'
  },
  roles: {
    harvester: {
      icon: '⚡',
      plans: {
        standard: [CARRY, WORK, MOVE, MOVE]
      }
    },
    upgrader: {
      icon: '▲',
      plans: {
        standard: [CARRY, CARRY, WORK, MOVE, MOVE]
      }
    },
    builder: {
      icon: '🔨',
      plans: {
        standard: [CARRY, CARRY, WORK, MOVE, MOVE]
      }
    }
  }
}

module.exports = constants
