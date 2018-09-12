
import transferer from './transferer'
import harvester from './harvester'
import upgrader from './upgrader'
import builder from './builder'
import claimer from './claimer'
import scribe from './scribe'

const roles = {} as any

roles.harvester = harvester
roles.transferer = transferer
roles.upgrader = upgrader
roles.builder = builder
roles.claimer = claimer
roles.scribe = scribe

export default roles
