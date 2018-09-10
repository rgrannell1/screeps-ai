
const path = require('path')

const constants = {
  appName: 'screeps-monitoring',
  shard: 'shard2',
  paths: {
    database: path.join(__dirname, '../data/screeps-events.json')
  }
}

module.exports = constants
