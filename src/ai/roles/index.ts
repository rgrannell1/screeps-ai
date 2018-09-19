
import transferer from './transferer'
import harvester from './harvester'
import repairer from './repairer'
import exporter from './exporter'
import upgrader from './upgrader'
import builder from './builder'
import claimer from './claimer'
import scribe from './scribe'

const roles = {} as any

roles.transferer = transferer
roles.harvester = harvester
roles.repairer = repairer
roles.exporter = exporter
roles.upgrader = upgrader
roles.builder = builder
roles.claimer = claimer
roles.scribe = scribe

export default roles
