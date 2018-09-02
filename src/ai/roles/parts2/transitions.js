
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

transitions.atLocation = ({onArrival, onMove}) => {
  return StateChange((ctx, states) => {
    assertProperties(ctx, ['target', 'creep'])

    var moveCode
    try {
      moveCode = ctx.creep.moveTo(ctx.target.target.pos)
    } catch (err) {
      return Transition(onMove, {
        reason: `target missing: ${err.message}`,
        name: 'atLocation'
      })
    }

    return misc.switch(moveCode, {
      [OK] () {
        return Transition(onArrival, {
          reason: 'arrived at target',
          name: 'atLocation'
        })
      },
      [ERR_NOT_IN_RANGE] () {
        console.error(`not in range`)
      },
      [ERR_INVALID_TARGET] (val) {
        console.error(`invalid target`)
      },
      [ERR_NO_PATH] (val) {
        console.error(`no path to target`)
      },
      default (val) {
        return Transition(onMove, {
          reason: `unknown move code ${val}`,
          name: 'atLocation'
        })
      }
    })
  })
}

transitions.maintainCreepEnergy = ({onEmpty, onFull}) => {
  return StateChange((ctx, states) => {
    const isFull = ctx.creep.carry.energy === ctx.creep.carryCapacity
    const isEmpty = ctx.creep.carry.energy === 0

    if (isFull && ctx.state !== onFull) {
      return Transition(onFull, {
        reason: 'full',
        name: 'maintainCreepEnergy'
      })
    }

    if (isEmpty && ctx.state !== isEmpty) {
      return Transition(onEmpty, {
        reason: `${ctx.creep.carry.energy} energy`,
        name: 'maintainCreepEnergy'
      })
    }
  })
}

module.exports = transitions
