
const misc = require('../misc')
const terrain = require('../terrain')

const plans = {
  ringRoads: require('./ring-roads'),
  sourceContainers: require('./source-containers'),
  extensions: require('./extensions'),
  miningRoads: require('./mining-roads'),
  exitRoads: require('./exit-roads'),
  frequentRoads: require('./frequent-roads')
}

module.exports = plans
