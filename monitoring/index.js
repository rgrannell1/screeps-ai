
const {ScreepsAPI} = require('screeps-api')

const main = async () => {
  const api = new ScreepsAPI({
    //token: process.env.SCREEPS_TOKEN
  })

  await api.auth()

  const events = await api.memory.get()
  console.log(JSON.stringify(events))
}

main()
