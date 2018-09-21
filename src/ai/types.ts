
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

export interface Infrastructure {
  plan (roomName:string):void
}

export type Template = Array<Array<StructureConstant>>
export type Plan = Array<Array<{type: StructureConstant, pos: RoomPosition}>>
export type Point = {
  x: number,
  y: number
}

export type RoleLabel = 'builder'| 'claimer'| 'harvester'| 'scribe'| 'transferer'| 'upgrader'

export interface SpawnOrder {
  readonly isRequired: boolean,
  readonly expected: number,
  readonly youngCount: number,
  readonly sufficientCount: number,
  readonly role: string
}
