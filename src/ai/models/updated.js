
const index = {}

const validate = {}

validate.stateMachine = (states, {initialState}) => {
  if (!states[initialState]) {
    throw new Error(`missing state "${initialState}"`)
  }
}

validate.transition = (transition, state) => {
  if (!transition) throw new Error('missing transition')
  if (!transition.run) throw new Error(`transition.run() is missing for state "${state}"`)
}

index.State = ({code, run, transitions}) => {
  if (!code) throw new Error('missing code')
  if (!run) throw new Error('missing run()')
  if (!transitions) throw new Error('missing transitions')

  return {code, run, transitions}
}

index.StateMachine = (states, {initialState, middleware}) => {
  let ctx = {state: initialState}
  validate.stateMachine(states, {initialState})
  const mappings = {}

  for (const key of Object.keys(states)) {
    mappings[key] = key
  }

  const methods = {}

  methods.transition = (ctx, state, newState) => {
    ctx.creep.memory.state = newState
  }

  methods.run = (ctx, creep) => {
    Object.assign(ctx, {creep})

    const currentRun = states[ctx.state]
    ctx = Object.assign({state: ctx.state}, currentRun.run(ctx))
    middleware.onRun(ctx)

    for (const transition of currentRun.transitions) {
      validate.transition(transition, ctx.state)
      const newState = transition.run(ctx, mappings)

      const innerState = newState
       ? newState.state
       : ctx.state

      middleware.onTransition(ctx, ctx.state, innerState)
      if (innerState !== ctx.state) {
        methods.transition(ctx, ctx.state, innerState)
        break
      }
    }
  }

  return {
    run: methods.run.bind(null, ctx)
  }
}

index.StateChange = run => {
  return {run}
}

index.Transition = (state, metadata) => {
  return {state, metadata}
}

module.exports = index
