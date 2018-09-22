
const interactive = {} as any

interactive.clearPlans = () => {
  Memory.plans = []
  Object.values(Game.constructionSites).forEach(site => site.remove())
}

interactive.clearFlags = () => {
  Object.values(Game.flags).forEach(flag => flag.remove())
}

export default interactive
global.interactive = interactive
