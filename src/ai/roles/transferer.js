
const misc = require('../misc')
const {Transition, State, StateMachine, StateChange} = require('../models/updated')

const transitions = {}

transitions.atLocation = StateChange((ctx, states) => {
  const moveCode = ctx.creep.moveTo(ctx.target.target)
  return misc.switch(moveCode, {
    [OK] () {
      return Transition(states.AT_LOCATION)
    },
    [ERR_NOT_IN_RANGE] () {
      return Transition(states.SEEKING_LOCATION)
    }
  })
})

transitions.maintainCreepEnergy = StateChange((ctx, states) => {
  if (ctx.creep.carry.energy === ctx.creep.carryCapacity) {
    return Transition(states.SEEKING_TARGET)
  } else if (ctx.creep.carry.energy === 0) {
    return Transition(states.SEEKING_SOURCE)
  }
})

const assertProperties = (ctx, props) => {
  for (const prop of props) {
    if (!ctx.hasOwnProperty(prop)) {
      throw new Error(`ctx has no property "${prop}"`)
    }
  }
}

const states = {}

/*

  Set 'target' to source, which signifies an energy source.

*/
states.SEEKING_SOURCE = State({
  code: '🚚📦',
  run (ctx) {
    assertProperties(ctx, ['creep'])
    const output = {
      creep: ctx.creep
    }

    let shouldSwitch = false
    if (ctx.target) {
      shouldSwitch = !structures.isSuitableEnergySource(ctx.target.target)
    }

    if (!ctx.target || shouldSwitch) {
      output.target = {
        target: structures.findEnergySource(ctx.creep.room.name),
        category: 'source'
      }
    }

    return output
  },
  transitions: [
    transitions.atLocation,
    transitions.maintainCreepEnergy
  ]
})

/*

  Drain energy from the source

*/
states.DRAINING_SOURCE = State({
  code: 'x',
  run (ctx) {
    assertProperties(ctx, ['creep'])
    return ctx.creep.withdraw(ctx.target.target, RESOURCE_ENERGY)
  },
  transitions: [
    transitions.maintainCreepEnergy
  ]
})

states.SEEKING_TARGET = State({
  code: '🚚📦',
  run (ctx) {
    assertProperties(ctx, ['creep'])

    let shouldSwitch = false
    if (output.target) {

    }

    if (!output.target || shouldSwitch) {
      output.target = structures.findEnergySource(creep.room.name)
    }

    return output
  },
  transitions: [
    transitions.maintainCreepEnergy
  ]
})

/*



*/
states.CHARGING_TARGET = State({
  code: 'x',
  run (ctx) {
    assertProperties(ctx, ['creep'])

  },
  transitions: [

  ]
})

const transferer = StateMachine({
  SEEKING_SOURCE: states.SEEKING_SOURCE,
  DRAINING_SOURCE: states.DRAINING_SOURCE,
  SEEKING_TARGET: states.SEEKING_TARGET,
  CHARGING_TARGET: states.CHARGING_TARGET
}, {
  initialState: 'SEEKING_SOURCE',
  middleware: {
    onRun: ctx => {
      // -- push events off to Memory.events.
    },
    onTransition: (ctx, state, newState) => {
      console.log(`${ctx.creep.name} ${state} -> ${newState}`)
    }
  }
})

module.exports = transferer
