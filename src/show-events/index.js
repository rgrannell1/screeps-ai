
const loki = require('lokijs')
const path = require('path')

const chai = require('chai')
const request = require('request-promise-native')
const chaiJsonSchema = require('chai-json-schema')
chai.use(chaiJsonSchema)

async function main () {
  const lk = new loki(path.join(__dirname, '../../data/screeps-events.json'))
  lk.loadDatabase({}, async () => {
    const lkEvents = lk.getCollection('events')

    const results = lkEvents.find()

    for (const doc of results) {

      await request.post(`http://localhost:9200/events/_doc/${doc.id}`, {
        json: doc
      })

    }
  })
}

main()
