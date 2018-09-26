
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

const sourceContainers = (roomName:string):void => {
  const room = Game.rooms[roomName]
  const minerals = terrain.findMinerals(roomName)
  for (const mineral of minerals) {
    const pos = new RoomPosition(mineral.pos.x, mineral.pos.y, roomName)
    structures.extractor.place(pos)
  }
}

export default sourceContainers
