
import misc from '../misc'
import terrain from '../terrain'
import structures from '../structures'
import templates from '../templates'
import constants from '../constants'
import interactive from '../interactive'
import Geometry from '../modules/geometry'
import Compute from '../modules/compute'

const state = {
  resultAcc: [],
  sortAcc: []
} as any

function iterTake (iter, store, batch:number):Array<any> {
  for (let ith = 0; ith < batch; ith++) {
    let yielded = iter.next()

    if (yielded.done) {
      return store
    } else {
      store.push(yielded.value)
    }
  }
}

const iterMap = function * (iter, fn) {
  for (let elem of iter) {
    yield fn(elem)
  }
}

let tileCount = 0

const spawnExtensions = (roomName:string):void => {
  const room = Game.rooms[roomName]

  if (roomName !== 'W42N31') {
    return
  }

  if (!state.result) {
    state.result = Geometry.yieldEmptyBlocks(roomName, {x: 3, y: 3})
  }

  let areas = iterTake(state.result, state.resultAcc, 400)

  if (areas) {
    const controller = terrain.findController(roomName)

    if (!state.sortResult) {
      state.sortResult = iterMap(areas, area => {
        return Geometry.boundDistance(controller.pos, area)
      })
    }

    let sorted = iterTake(state.sortResult, state.sortAcc, 400)
    if (sorted) {
      const {bounds} = sorted.reduce((acc, current) => {
        return current.distance < acc.distance ? current : acc
      })

      const plan = Geometry.plan(templates.extensions(), new RoomPosition(bounds.x0, bounds.y0, roomName))

      interactive.drawPositions(
        roomName,
        Geometry.expandBounds(roomName, bounds)
       )
    }
  }

}

export default spawnExtensions
