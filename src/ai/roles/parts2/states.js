
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
    transitions.atLocation({
      onArrival:'DRAINING_SOURCE',
      onMove: 'SEEKING_SOURCE'
    }),
    transitions.maintainCreepEnergy({
      onEmpty: 'DRAINING_SOURCE',
      onFull: 'SEEKING_TARGET'
    }),
  ]
})

/*

  Drain energy from the source

*/
states.DRAINING_SOURCE = State({
  code: 'x',
  run (ctx) {
    assertProperties(ctx, ['creep'])

    if (!ctx.target) {
      console.log(blessed.red(`missing ctx.target`))
      return ctx
    }
    if (ctx.target.category !== 'source') {
      console.log(blessed.red(`cannot use "${ctx.target.category}" category .target as source; skipping action`))
      return ctx
    }

    misc.switch(ctx.creep.withdraw(ctx.target.target, RESOURCE_ENERGY), {
      [OK] () {},
      [ERR_FULL] () {
        console.log(blessed.red(`${ctx.creep.name} already full, no need to drain`))
      },
      [ERR_INVALID_TARGET] () {
        console.log(blessed.red(`${ctx.creep.name} trying to drain invalid target:\n${JSON.stringify(ctx.target, null, 2)}`))
      },
      [ERR_NOT_IN_RANGE] () {
        console.log(blessed.red(`${ctx.creep.name} not in range to drain target`))
      },
      default (val) {
        console.log(`invalid DRAINING_SOURCE code ${val}`)
      }
    })

    return ctx
  },
  transitions: [
    transitions.maintainCreepEnergy({
      onEmpty: 'SEEKING_SOURCE',
      onFull: 'SEEKING_TARGET'
    })
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

    // -- should not be required; at location should handle this.
    ctx.creep.moveTo(output.target.value.pos)

    return output
  },
  transitions: [
    transitions.atLocation({
      onArrival: 'CHARGING_TARGET',
      onMove: 'SEEKING_TARGET'
    }),
    transitions.maintainCreepEnergy({
      onEmpty: 'SEEKING_SOURCE',
      onFull: 'SEEKING_TARGET'
    })
  ]
})

states.CHARGING_TARGET = State({
  code: 'x',
  run (ctx) {
    assertProperties(ctx, ['creep'])

    ctx.creep.transfer(ctx.target.value, RESOURCE_ENERGY)

    return {
      metrics: {

      }
    }
  },
  transitions: [
    transitions.maintainCreepEnergy({
      onEmpty: 'SEEKING_SOURCE',
      onFull: 'CHARGING_TARGET'
    })
  ]
})

module.exports = states
