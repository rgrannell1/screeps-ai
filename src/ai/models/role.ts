
import constants from '../constants';
import telemetry from '../telemetry';
import blessed from '../blessed';

const methods = {} as any

methods.transition = (ctx, state, newState, creep) => {
  const reason = newState.reason ? ` (${newState.reason})` : ' '

  console.log(`${creep.name} (${blessed.bold(creep.memory.role)}) ${state} → ${blessed.green(newState.state)}${reason}`)

  Object.assign(creep.memory, {
    state: newState.state,
    stateCode: ctx.states[newState.state] ? ctx.states[newState.state].code : null,
    stateTicks: 0
  })
}

methods.validate = (ctx, creep) => {
  const state = creep.memory.state
  const methods = {}

  methods.transition = (ctx, state, newState, creep) => {
    const reason = newState.reason ? ` (${newState.reason})` : ' '

    console.log(`${creep.name} (${blessed.bold(creep.memory.role)}) ${state} → ${blessed.green(newState.state)}${reason}`)
    creep.memory.state = newState.state
    creep.memory.stateCode = ctx.states[newState.state] ? ctx.states[newState.state].code : null
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
      throw new Error(`invalid configuration for state "${state}" (${role})`)
    }

    current.until.forEach((trans, ith) => {
      if (!trans) {
        throw new Error(`${role} missing #${ith} state-change for state "${state}"`)
      }
      if (typeof trans.run !== 'function') {
        throw new Error(`${role} missing #${ith} state-change for  functionstate "${state}"`)
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
      const trans = transition.run(creep, transition.states)
      const newState = typeof trans === 'string'
        ? {state: trans}
        : trans

      if (newState && newState.state) {
        if (state !== newState.state) {
          methods.transition(ctx, state, newState, creep)
          return
        }
      }
    }

    creep.memory.stateTicks++
    if (creep.memory.stateTicks > 100) {
      telemetry.emit(constants.events.tickWarning, {
        name: creep.name,
        role: creep.memory.role,
        ticks: creep.memory.stateTicks
      })

      if (creep.memory.stateTicks % 5 === 0) {
        console.log(`${creep.name} still in state ${state} after ${creep.memory.stateTicks} ticks`)
      }
    }
  }

  function Role (states, {initalState}) {
    const ctx = {states, initalState}
    ctx.run = methods.run.bind(null, ctx)
    return ctx
  }

  const role = creep.memory.role

  if (!ctx.states.hasOwnProperty(state)) {
    creep.memory.state = ctx.initalState
    throw new Error(`state ${state} for role ${role} not supported; reverting to initial-state`)
  }

  const current = ctx.states[state]

  if (!current || typeof current.do !== 'function') {
    throw new Error(`invalid configuration for state "${state}" (${role})`)
  }

  current.until.forEach((trans, ith) => {
    if (!trans) {
      throw new Error(`${role} missing #${ith} state-change for state "${state}"`)
    }
    if (typeof trans.run !== 'function') {
      throw new Error(`${role} missing #${ith} state-change for  functionstate "${state}"`)
    }

    // validate state-set

  })
}

methods.run = (ctx, creep) => {
  if (!creep.memory.state) {
    creep.memory.state = ctx.initalState
    creep.memory.stateTicks = 0
  }
  methods.validate(ctx, creep)

  const {state, role} = creep.memory
  const response = ctx.states[state].do(creep)

  for (const transition of ctx.states[state].until) {
    const trans = transition.run(creep, transition.states)
    const newState = typeof trans === 'string'
      ? {state: trans}
      : trans

    if (newState && newState.state) {
      if (state !== newState.state) {
        methods.transition(ctx, state, newState, creep)
        return
      }
    }
  }

  creep.memory.stateTicks++
  if (creep.memory.stateTicks > 100) {
    telemetry.emit(constants.events.tickWarning, {
      name: creep.name,
      role: creep.memory.role,
      ticks: creep.memory.stateTicks
    })

    if (creep.memory.stateTicks % 5 === 0) {
      console.log(`${creep.name} still in state ${state} after ${creep.memory.stateTicks} ticks`)
    }
  }
}

function Role (states, {initalState}) {
  const ctx = {states, initalState}
  ctx.run = methods.run.bind(null, ctx)
  return ctx
}

export default Role;
