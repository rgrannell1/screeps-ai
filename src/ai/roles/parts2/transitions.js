
const misc = require('../../misc')
const middleware = require('../middleware')
const blessed = require('../../blessed')
const {Transition, State, StateMachine, StateChange} = require('../../models/updated')

const assertProperties = (ctx, props) => {
  for (const prop of props) {
    if (!ctx.hasOwnProperty(prop)) {
      throw new Error(`ctx has no property "${prop}"`)
    }
  }
}

const transitions = {}

transitions.atLocation = (ARRIVAL_STATE, MOVING_STATE) => {
  return StateChange((ctx, states) => {
    assertProperties(ctx, ['target', 'creep'])

    var moveCode
    try {
      moveCode = ctx.creep.moveTo(ctx.target.target.pos)
    } catch (err) {
      return Transition(MOVING_STATE, {
        reason: 'target missing'
      })
    }

    if (ctx.creep.memory.debug) {} {
      console.log('debugging')
    }

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
        return Transition(MOVING_STATE, {
          reason: 'invalid target'
        })
      },
      default (val) {
        return Transition(MOVING_STATE, {
          reason: `unknown status code ${val}`
        })
      }
    })
  })
}

transitions.maintainCreepEnergy = () => {
  return StateChange((ctx, states) => {
    if (ctx.creep.carry.energy === ctx.creep.carryCapacity) {
      return Transition(states.SEEKING_TARGET, {
        reason: 'full'
      })
    } else if (ctx.creep.carry.energy === 0) {
      return Transition(states.SEEKING_SOURCE, {
        reason: `${ctx.creep.carry.energy} energy`
      })
    }
  })
}

module.exports = transitions
