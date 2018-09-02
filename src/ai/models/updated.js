
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

validate.transitionState = (result, transition) => {
  if (typeof result !== 'undefined' && typeof result !== 'object') {
    throw new Error(`invalid return value "${result} from ${transition}"`)
  }
}

validate.stateRun = (ctx, curentResult) => {
  if (typeof curentResult !== 'object' || curentResult === null) {
    throw new Error(`non-object ctx returned for state ${ctx.state}: ${JSON.stringify(curentResult)}`)
  }
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
    if (!newState.state) {
      throw new Error(`trying to transition to undefined state.`)
    }

    middleware.onTransition(ctx, ctx.state, newState)

    ctx.creep.memory.state = newState.state
    ctx.state = newState.state
  }

  methods.run = (ctx, creep) => {
    Object.assign(ctx, {creep})

    const curentState = creep.memory.state || initialState
    const currentRun = states[curentState]
    if (!states[curentState]) {
      console.log(`${curentState} not a supported state!; falling back to "${initialState}"`)

      methods.transition(ctx, null, {
        state: initialState,
        metadata: {
          reason: 'exception occurred.',
          name: '.run'
        }
      })
      return
    }

    const curentResult = currentRun.run(ctx)
    validate.stateRun(ctx, curentResult)

    Object.assign(ctx, curentResult, {state: curentState})
    middleware.onRun(ctx)

    for (const transition of currentRun.transitions) {
      validate.transition(transition, curentState)
      const transitionResult = transition.run(ctx, mappings)

      validate.transitionState(transitionResult, transition)

      const newState = transitionResult
       ? transitionResult
       : {
          state: curentState,
          reason: 'current state',
          name: 'default'
        }

      if (newState && newState.state !== curentState) {
        methods.transition(ctx, curentState, newState)
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
  if (!state) {
    throw new Error(`state missing alongside metadata ${JSON.stringify(metadata)}`)
  }
  return {state, metadata}
}

module.exports = index
