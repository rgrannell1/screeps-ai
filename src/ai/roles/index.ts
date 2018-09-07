
import Role from '../models/role'
import actions from './parts/actions'
import senses from './parts/senses'
import states from './parts/states'

import transferer from './transferer'
import upgrader from './upgrader'
import builder from './builder'

const roles = {} as any

roles.harvester = Role({
  SEEKING_SOURCE: states.SEEKING_SOURCE(),
  HARVEST: states.HARVEST(),
  SEEKING_SPAWN: states.SEEKING_SPAWN(),
  SEEKING_CONTAINER: states.SEEKING_CONTAINER(),
  CHARGE_SPAWN: states.CHARGE_SPAWN(),
  CHARGE_CONTAINER: states.CHARGE_CONTAINER(),
  SEEKING_EXTENSION: states.SEEKING_EXTENSION()
}, {
  initalState: 'SEEKING_SOURCE'
})

roles.scribe = Role({
  SEEKING_CONTROLLER: states.SEEKING_CONTAINER(),
  SIGNING: states.SIGNING(),
  DYING: states.DYING()
}, {
  initalState: 'SEEKING_CONTROLLER'
})

roles.transferer = transferer
roles.upgrader = upgrader
roles.builder = builder

export default roles
