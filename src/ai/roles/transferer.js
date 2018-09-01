
const misc = require('../misc')
const blessed = require('../blessed')
const {Transition, State, StateMachine, StateChange} = require('../models/updated')

const transitions = {}

transitions.atLocation = (ARRIVAL_STATE, MOVING_STATE) => {
  return StateChange((ctx, states) => {
    const moveCode = ctx.creep.moveTo(ctx.target.target.pos)

    return misc.switch(moveCode, {
      [OK] () {
        return Transition(ARRIVAL_STATE, {
          reason: 'arrived'
        })
      },
      [ERR_NOT_IN_RANGE] () {
        return Transition(MOVING_STATE, {
          reason: 'still moving'
        })
      },
      [ERR_INVALID_TARGET] (val) {
        console.log(`invalid target provided`)
      }
    })
  })
}


transitions.maintainCreepEnergy = StateChange((ctx, states) => {
  if (ctx.creep.carry.energy === ctx.creep.carryCapacity) {
    return Transition(states.SEEKING_TARGET, {
      reason: 'full'
    })
  } else if (ctx.creep.carry.energy === 0) {
    return Transition(states.SEEKING_SOURCE, {
      reason: 'empty'
    })
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
      shouldSwitch = false
      //shouldSwitch = !structures.isSuitableEnergySource(ctx.target.target)
    }

    if (!ctx.target || shouldSwitch) {
      output.target = {
        target: structures.findEnergySource(ctx.creep.room.name, ['container']),
        category: 'source'
      }
    }

    return output
  },
  transitions: [
    transitions.atLocation('DRAINING_SOURCE', 'SEEKING_SOURCE'),
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
    const output = {
      creep: ctx.creep
    }

    let shouldSwitch = false
    if (output.target) {
      // -- check the target is valid.
    }

    if (!output.target || shouldSwitch) {
      output.target = structures.findEnergySink(ctx.creep.room.name, ['tower'])
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
    console.log('at target now')

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
      console.log('running state.')
    },
    onTransition: (ctx, state, newState) => {
      console.log(`${ctx.creep.name} ${state} -> ${newState.state} (${blessed.blue(newState.metadata.reason)})`)
    }
  }
})

module.exports = transferer
