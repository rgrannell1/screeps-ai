
const interactive = {
  visualise: {}
} as any

interactive.clearPlans = () => {
  Memory.plans = []
  Object.values(Game.constructionSites).forEach(site => site.remove())
}

interactive.clearFlags = () => {
  Object.values(Game.flags).forEach(flag => flag.remove())
}

interactive.drawPositions = (roomName:string, positions:RoomPosition[]) => {
  positions.forEach(pos => {
    new RoomVisual(roomName).rect(pos.x - 0.5, pos.y - 0.5, 1, 1)
  })
}

interactive.clearDrawnPlans = (roomName:string) => {
  new RoomVisual(roomName).clear()
}

interactive.visualise = (roomName:string, structure:StructureConstant, pos:RoomPosition) => {
  if (interactive.visualise[structure]) {
    return interactive.visualise[structure](roomName, pos)
  } else {
    console.log(`no visualisation found for ${structure}`)
  }
}

interactive.visualise[STRUCTURE_EXTENSION] = (roomName:string, pos:RoomPosition) => {
  new RoomVisual(roomName).circle(pos.x, pos.y, {
    fill: 'yellow',
    opacity: 0.1725
  })
}

interactive.visualise[STRUCTURE_ROAD] = (roomName:string, pos:RoomPosition) => {
  new RoomVisual(roomName).rect(pos.x - 0.5, pos.y - 0.5, 0.75, 0.75, {
    fill: 'white',
    opacity: 0.1725
  })
}

interactive.visualise[STRUCTURE_CONTAINER] = (roomName:string, pos:RoomPosition) => {
  new RoomVisual(roomName).circle(pos.x, pos.y, {
    fill: 'red'
  })
}

export default interactive
