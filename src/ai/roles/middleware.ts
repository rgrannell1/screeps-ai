
import blessed from '../blessed';

const serial = fns => (...args) => {
  fns.forEach(fn => fn(...args))
}

const middleware = {}

middleware.countStateTicks = ctx => {

}

middleware.logState = ctx => {
  console.log(`${blessed.bold(ctx.creep.name)} in state "${blessed.green(ctx.creep.memory.state)}"`)
}

middleware.logTransition = (ctx, state, newState) => {
  const reason = newState.metadata && newState.metadata.reason
    ? newState.metadata.reason
    : 'unknown'

  const name = newState.metadata && newState.metadata.name
    ? newState.metadata.name
    : 'unknown'

  console.log(`${ctx.creep.name} ${state} -> ${newState.state} (${blessed.blue(name + ':' + reason)})`)
}

const chains = {}

chains.onRun = serial([
  middleware.logState
])

chains.onTransition = serial([
  middleware.logTransition
])

export default chains;
