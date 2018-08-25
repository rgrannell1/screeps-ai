
const methods = {}

methods.transition = (ctx, state, newState, creep) => {
  console.log(`${creep.name} (${creep.memory.role}) ${state} -> ${newState}`)
  creep.memory.state = newState
  creep.memory.stateCode = ctx.states[newState].code
  creep.memory.stateTicks = 0
}

methods.validate = (ctx, creep) => {
  const state = creep.memory.state
  const role = creep.memory.role

  if (!ctx.states.hasOwnProperty(state)) {
    creep.memory.state = ctx.initalState
    throw new Error(`state ${state} for role ${role} not supported; reverting to initial-state`)
  }

  const current = ctx.states[state]

  if (!current || typeof current.do !== 'function') {
    throw new Error(`invalid configuration for state "${state}"`)
  }

  current.until.forEach((trans, ith) => {
    if (typeof trans.run !== 'function') {
      throw new Error(`${role} missing #${ith} state-change for state "${state}"`)
    }

    // validate state-set

  })
}

methods.run = (ctx, creep) => {
  if (!creep.memory.hasOwnProperty('state')) {
    creep.memory.state = ctx.initalState
    creep.memory.stateTicks = 0
  }
  methods.validate(ctx, creep)

  const {state, role} = creep.memory
  const response = ctx.states[state].do(creep)

  for (const transition of ctx.states[state].until) {
    const newState = transition.run(creep, transition.states)

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
