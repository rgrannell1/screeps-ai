
const trade = {} as any

trade.buyOrders = (resource:ResourceConstant):Order[] => {
  return Game.market.getAllOrders({
    type: ORDER_BUY,
    resourceType: resource
  })
}

trade.sellOrders = (resource:ResourceConstant):Order[] => {
  return Game.market.getAllOrders({
    type: ORDER_SELL,
    resourceType: resource
  })
}

trade.getEnergyCost = (resourceCount: number, roomName1:string, roomName2:string):number => {
  return Game.market.calcTransactionCost(resourceCount, roomName1, roomName2)
}

export default trade
