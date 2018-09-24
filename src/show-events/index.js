
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

const sql = {}
sql.retrieveEvents = `
SELECT *
FROM events
ORDER BY id
LIMIT ?, ?;
`

sql.countEvents = `
SELECT count(*) AS event_count
FROM events;
`

async function main (emitter, event) {
  const fpath = path.join(__dirname, '../../data/screeps-events.sqlite')
  const sqlDb = await sqlite.open(fpath)

  await elasticsearch.setEventMapping()
  const [countResult] = await sqlDb.all(sql.countEvents, [])

  emitter.emit(event, `writing ${countResult.event_count} events to ElasticSearch.`)

  let skip = 0
  const batch = 250

  while (true) {
    let results = await sqlDb.all(sql.retrieveEvents, [skip, batch])
    if (results.length === 0) {
      return
    } else {
      emitter.emit(event, `writing ${skip}...${skip + batch} of ${countResult.event_count} events to ElasticSearch`)
    }

    for (const doc of results) {
      await request.post(`http://localhost:9200/events/_doc/${doc.id}`, {json: JSON.parse(doc.content)})
    }

    skip += 100
  }
}

module.exports = main
