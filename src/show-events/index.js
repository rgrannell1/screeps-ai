
const sqlite = require('sqlite')
const path = require('path')
const request = require('request-promise-native')

const elasticsearch = {}

elasticsearch.setEventMapping = async function () {
  const mapping = {
    template: 'events',
    aliases: {},
    settings: {},
    mappings: {
      _default_: {}
    }
  }

  mapping.mappings._default_.properties = {
    id: {
      type: 'keyword'
    },
    label: {
      type: 'keyword'
    },
    run_id: {
      type: 'keyword'
    },
    time: {
      type: 'date',
      format: 'epoch_millis'
    },
    data: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            code: {
              type: 'keyword'
            },
            creep_name: {
              type: 'keyword'
            }
          }
        }
      }
    }
  }

  return request.put(`http://localhost:9200/_template/events`, {json: mapping})
}

async function main (emitter, event) {
  const fpath = path.join(__dirname, '../../data/screeps-events.sqlite')
  const sqlDb = await sqlite.open(fpath)

  const results = await sqlDb.all('SELECT * FROM events', [])

  await elasticsearch.setEventMapping()
  emitter.emit(event, `writing ${results.length} events to ElasticSearch.`)

  for (const doc of results) {
    await request.post(`http://localhost:9200/events/_doc/${doc.id}`, {json: JSON.parse(doc.content)})
  }

}

module.exports = main
