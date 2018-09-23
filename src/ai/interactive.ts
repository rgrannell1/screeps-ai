
const interactive = {} as any

interactive.clearPlans = () => {
  Memory.plans = []
  Object.values(Game.constructionSites).forEach(site => site.remove())
}

interactive.clearFlags = () => {
  Object.values(Game.flags).forEach(flag => flag.remove())
}

interactive.drawPlans = (roomName:string) => {
  const room = Game.rooms[roomName]

  if (!Memory.plans) {
    return
  }

  Memory.plans
    .filter(data => {
      return data.pos.roomName === roomName
    })
    .forEach(plan => {

    let text = ''
    if (plan.plan.label) {
      text += plan.plan.label + ' '
    }
    if (plan.plan.structure) {
      text += plan.plan.structure + ' '
    }


    new RoomVisual(roomName).circle(plan.pos.x, plan.pos.y)
    new RoomVisual(roomName).text(text, plan.pos.x, plan.pos.y, {
      font: '10px'
    })
  })

  interactive.clearDrawnPlans()
}

interactive.drawPositions = (roomName:string, positions:RoomPosition[]) => {
  positions.forEach(pos => {
    new RoomVisual(roomName).rect(pos.x, pos.y, 1, 1)
  })
}

interactive.clearDrawnPlans = (roomName:string) => {
  new RoomVisual(roomName).clear()
}

export default interactive
