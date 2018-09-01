
const blessed = require('../blessed')

const middleware = {}

middleware.onRun = ctx => {
  console.log('running state.')
}

middleware.onTransition = (ctx, state, newState) => {
  console.log(`${ctx.creep.name} ${state} -> ${newState.state} (${blessed.blue(newState.metadata.reason)})`)
}

module.exports = middleware
