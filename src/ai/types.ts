
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
export type Bounds = {
  readonly x0: number,
  readonly x1: number,
  readonly y0: number,
  readonly y1: number
}

export type RoleLabel = 'builder'| 'claimer'| 'harvester'| 'scribe'| 'transferer'| 'upgrader'

export interface SpawnOrder {
  readonly isRequired: boolean,
  readonly expected: number,
  readonly youngCount: number,
  readonly sufficientCount: number,
  readonly role: string
}

export interface BuildingPlan {
  readonly label: string,
  readonly positions: RoomPosition[],
  readonly structure: StructureConstant
}
