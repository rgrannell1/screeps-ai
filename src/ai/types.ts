
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
