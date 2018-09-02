
const blessed = require('../blessed')

const serial = fns => (...args) => {
  fns.forEach(fn => fn(...args))
}

const middleware = {}

middleware.logState = ctx => {
  console.log(`${ctx.creep.name} in state "${blessed.green(ctx.creep.memory.state)}"`)
}

middleware.logTransition = (ctx, state, newState) => {
  const reason = newState.metadata && newState.metadata.reason
    ? newState.metadata.reason
    : 'unknown'

  console.log(`${ctx.creep.name} ${state} -> ${newState.state} (${blessed.blue(reason)})`)
}

const chains = {}

chains.onRun = serial([
  middleware.logState
])

chains.onTransition = serial([
  middleware.logTransition
])

module.exports = chains
