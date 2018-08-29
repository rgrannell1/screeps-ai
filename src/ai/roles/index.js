
const Role = require('../models/role')
const actions = require('./parts/actions')
const senses = require('./parts/senses')
const states = require('./parts/states')

const roles = {}

roles.builder = Role({
  SEEKING_CHARGE: states.SEEKING_CHARGE(),
  CHARGE: states.CHARGE(),
  SEEKING_SITE: states.SEEKING_SITE(),
  BUILDING: states.BUILDING()
}, {
  initalState: 'SEEKING_CHARGE'
})

roles.harvester = Role({
  SEEKING_SOURCE: states.SEEKING_SOURCE(),
  HARVEST: states.HARVEST(),
  SEEKING_SPAWN: states.SEEKING_SPAWN(),
  SEEKING_CONTAINER: states.SEEKING_CONTAINER(),
  CHARGE_SPAWN: states.CHARGE_SPAWN(),
  CHARGE_CONTAINER: states.CHARGE_CONTAINER()
}, {
  initalState: 'SEEKING_SOURCE'
})

roles.repairer = Role({
  SEEKING_CHARGE: states.SEEKING_CHARGE(),
  CHARGE: states.CHARGE(),
  REPAIR: states.REPAIR(),
  SEEKING_DAMAGE: states.SEEKING_DAMAGE()
}, {
  initalState: 'SEEKING_CHARGE'
})

roles.scribe = Role({
  SEEKING_CONTROLLER: states.SEEKING_CONTAINER(),
  SIGNING: states.SIGNING(),
  DYING: states.DYING()
}, {
  initalState: 'SEEKING_CONTROLLER'
})

roles.defender = Role({
  SEEKING_ENEMY: states.SEEKING_ENEMY(),
  ATTACKING: states.ATTACKING(),
}, {
  initalState: 'SEEKING_ENEMY'
})

roles.transferer = require('./transferer')
roles.upgrader = require('./upgrader')

module.exports = roles
