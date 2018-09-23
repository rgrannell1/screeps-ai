
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
}

interactive.drawPositions = (roomName:string, positions:RoomPosition[]) => {
  positions.forEach(pos => {
    const {x, y} = pos
    new RoomVisual(roomName).rect(x - 0.5, y - 0.5, 1, 1, {
      fill: '#008080'
    })
  })
}

interactive.clearDrawnPlans = (roomName:string) => {
  new RoomVisual(roomName).clear()
}

export default interactive
