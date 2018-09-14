
export interface Priority {
  readonly label: string,
  readonly priorities: string[]
}

export interface Role {
  run (creep:Creep):void
}

export interface Tower {
  run (roomName:string):void
}

export type RoleLabel = 'builder'| 'claimer'| 'harvester'| 'scribe'| 'transferer'| 'upgrader'

export interface SpawnOrder {
  readonly isRequired: boolean,
  readonly expected: number,
  readonly youngCount: number,
  readonly role: string
}
