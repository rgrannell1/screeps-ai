
const loki = require('lokijs')
const path = require('path')

const chai = require('chai')
const request = require('request-promise-native')
const chaiJsonSchema = require('chai-json-schema')
chai.use(chaiJsonSchema)

const types = {}

types.event = {
  title: 'eventSchema',
  type: 'object',
  required: ['data', 'id', 'label', 'meta', 'time'],
  properties: {
    data: {
      type: 'object'
    },
    id: {
      type: 'keyword'
    },
    label: {
      type: 'keyword'
    },
    meta: {
      type: 'object'
    },
    time: {
      type: 'number'
    }
  }
}

async function setMapping () {
  const mapping = {
    template: 'events',
    aliases: {},
    settings: {},
    mappings: {
      _default_: {
        properties: {
          id: {
            type: 'keyword'
          },
          label: {
            type: 'keyword'
          },
          time: {
            type: 'date',
            format: 'epoch_millis'
          },
          data: {
            type: 'object',
            properties: {

            }
          }
        }
      }
    }
  }

  return request.put(`http://localhost:9200/_template/events`, {
    json: mapping
  })
}

async function main (emitter, event) {
  const lk = new loki(path.join(__dirname, '../../data/screeps-events.json'))

  lk.loadDatabase({}, async () => {
    const lkEvents = lk.getCollection('events')
    const results = lkEvents.find()


    await setMapping()
    emitter.emit(event, `writing ${results.length} events to ElasticSearch.`)

    for (const doc of results) {
      await request.post(`http://localhost:9200/events/_doc/${doc.id}`, {
        json: doc
      })
    }
  })
}

module.exports = main
