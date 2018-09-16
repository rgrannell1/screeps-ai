
const loki = require('lokijs')
const path = require('path')

async function main () {
  const lk = new loki(path.join(__dirname, '../../data/screeps-events.json'))
  const lkEvents = lk.addCollection('events')



  lk.saveDatabase()
}

main()
