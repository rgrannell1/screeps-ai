
import Role from '../models/role'

import transferer from './transferer'
import harvester from './harvester'
import upgrader from './upgrader'
import builder from './builder'
import scribe from './scribe'

const roles = {} as any

roles.harvester = harvester
roles.transferer = transferer
roles.upgrader = upgrader
roles.builder = builder
roles.scribe = scribe

export default roles
