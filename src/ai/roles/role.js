
const methods = {}

methods.transition = (ctx, state, newState, creep) => {
  console.log(`${creep.name} (${creep.memory.role}) ${state} -> ${newState}`)
  creep.memory.state = newState
  creep.memory.stateTicks = 0
}

methods.run = (ctx, creep) => {
  if (!creep.memory.hasOwnProperty('state')) {
    creep.memory.state = ctx.initalState
    creep.memory.stateTicks = 0
  }
  const state = creep.memory.state

  if (!ctx.states.hasOwnProperty(state)) {
    creep.memory.state = ctx.initalState
    throw new Error(`state ${state} not supported; reverting to initialState`)
  }
  const current = ctx.states[state]
  const onState = current.do

  if (typeof onState !== 'function') {
    throw new Error(`invalid configuration for state "${state}"`)
  }

  const response = onState(creep)
  current.until.forEach((trans, ith) => {
    if (typeof trans !== 'function') {
      throw new Error(`missing #${ith} transition function for state "${state}"`)      
    }
  })

  for (const transition of current.until) {
    const newState = transition(creep, response)

    if (newState) {
      if (`${newState}` !== newState) {
        throw new Error('non-string state returned')
      }

      if (state !== newState) {
        methods.transition(ctx, state, newState, creep)
        return
      }
    }
  }

  creep.memory.stateTicks++
  if (creep.memory.stateTicks > 100) {
    console.log(`${creep.name} still in state ${state} after ${creep.memory.stateTicks} ticks`)
  }
}

function Role (states, {initalState}) {
  const ctx = {states, initalState}
  ctx.run = methods.run.bind(null, ctx)
  return ctx
}

module.exports = Role
