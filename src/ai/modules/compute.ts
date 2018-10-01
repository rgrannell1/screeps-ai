
import {Computation} from '../types'

const Compute = {} as any

/*
## Compute.evaluate

*/
Compute.evaluate = <T>(comp:Computation<T>, storeRef, by:number):T[] | undefined => {
  for (let ith = 0; ith < by; ith++) {
    let yielded = comp.next()

    if (yielded.done) {
      return storeRef
    } else {
      storeRef.push(yielded.value)
    }
  }
}

/*
## Compute.map

*/
Compute.map = function * <T, U>(comp:Computation<T>, fn:Function):Computation<U> {
  for (const yielded of comp) {
    yield fn(yielded)
  }
}

export default Compute

