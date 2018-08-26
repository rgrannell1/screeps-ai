// Memory.creepPositionRecords


const constants = require('../constants')
const structures = require('../structures')

const frequentRoads = roomName => {
  const records = Memory.creepPositionRecords
  const elements = []

  for (const xPos of Object.keys(records)) {
    for (const yPos of Object.keys(records[xPos])) {
      elements.push({
        x: xPos,
        y: yPos,
        count: records[xPos][yPos]
      })
    }
  }

  const filtered = elements
    .sort((elem0, elem1) => elem0.count - elem1.count)
    .filter(elem => elem.count > 0)

  const percentile = Math.ceil(0.85 * elements.length)
  filtered
    .slice(percentile)
    .forEach(plan => {
      const roadPlan = {
        x: parseInt(plan.x),
        y: parseInt(plan.y),
        roomName
      }

      structures.roads.place(roadPlan, {label: 'frequent-roads'})
    })
}

module.exports = frequentRoads
