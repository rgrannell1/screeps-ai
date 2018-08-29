
const misc = require('../misc')
const terrain = require('../terrain')

const plans = {
  ringRoads: require('./ring-roads'),
  sourceContainers: require('./source-containers'),
  miningRoads: require('./mining-roads'),
  exitRoads: require('./exit-roads'),
  frequentRoads: require('./frequent-roads'),
  spawnExtensions: require('./spawn-extensions'),
  towers: require('./towers'),
}

module.exports = plans
