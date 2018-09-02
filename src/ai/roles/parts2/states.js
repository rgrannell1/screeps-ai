
const misc = require('../../misc')
const middleware = require('../middleware')
const blessed = require('../../blessed')
const {Transition, State, StateMachine, StateChange} = require('../../models/updated')
const transitions = require('./transitions')

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
      if (!ctx.target.target) {
        shouldSwitch = true
      }
    }

    if (!ctx.target || ctx.target.category !== 'source' || shouldSwitch) {
      output.target = {
        target: structures.findEnergySource(ctx.creep.room.name, ['container']),
        category: 'source'
      }
    }

    return output
  },
  transitions: [
    transitions.maintainCreepEnergy(),
    transitions.atLocation('DRAINING_SOURCE', 'SEEKING_SOURCE'),
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
    transitions.maintainCreepEnergy()
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

    if (!output.target || ctx.target.category !== 'target' || shouldSwitch) {
      const target = structures.findEnergySink(ctx.creep.room.name, ['spawn', 'towers', 'extensions'])
      if (target && target.value) {
        output.target = {
          category: 'target',
          value: target.value,
          label: target.label
        }
      }
    }

    return output
  },
  transitions: [
    transitions.maintainCreepEnergy(),
    transitions.atLocation('CHARGING_TARGET', 'SEEKING_TARGET')
  ]
})

states.CHARGING_TARGET = State({
  code: 'x',
  run (ctx) {
    assertProperties(ctx, ['creep'])

    ctx.creep.transfer(ctx.target.target, RESOURCE_ENERGY)

    return {
      metrics: {

      }
    }
  },
  transitions: [
    transitions.maintainCreepEnergy()
  ]
})

module.exports = states
