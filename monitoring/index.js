
const request = require('request-promise-native')

const constants = {
  urls: {
    screeps: ' https://screeps.com/api'
  }
}

global.token = process.env.SCREEPS_TOKEN

if (!global.token) {
  throw new Error('missing token.')
}

const requests = {}

requests.getMemory = () => {
  return request.get({
    uri: `${constants.urls.screeps}/user/memory?shard=shard2`,
    headers: {
      'X-Token': global.token
    },
    json: true
  })
}

const main = async () => {

  const body = await requests.getMemory()

  console.log(JSON.stringify(body))

}

main()
