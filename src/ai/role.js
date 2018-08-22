
function Role (states, {initalState}) {
  const ctx = {
    states
  }

  ctx.run = creep => {
    if (!creep.memory.hasOwnProperty('state')) {
      creep.memory.state = initalState
      creep.memory.stateTicks = 0
    }
    const state = creep.memory.state

    if (!ctx.states.hasOwnProperty(state)) {
      creep.memory.state = initalState
      throw new Error(`state ${state} not supported; reverting to initialState`)
    }
    const current = ctx.states[state]
    const onState = current.do

    if (typeof onState !== 'function') {
      throw new Error(`invalid configuration for state "${state}"`)
    }

    const response = onState(creep)

    for (const transition of current.until) {
      if (!transition) {
        throw new Error(`missing transition for state "${state}"`)
      }
      const newState = transition(creep, response)

      if (newState) {
        if (`${newState}` !== newState) {
          throw new Error('non-string state returned')
        }

        if (state !== newState) {
          console.log(    `${creep.name} ${state} -> ${newState}`)
          creep.memory.state = newState
          creep.memory.stateTicks = 0
          return
        }
      }
    }

    creep.memory.stateTicks++
    if (creep.memory.stateTicks > 100) {
      console.log(`${creep.name} still in state ${state} after ${creep.memory.stateTicks} ticks`)
    }
  }

  return ctx
}

module.exports = Role
