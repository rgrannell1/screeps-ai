
import {Computation} from '../types'

const Compute = {} as any

/*
## Compute.evaluate

*/

interface EvaluateConfig<T> {
  computation: Computation<T>,
  storage: any[],
  by: number
}

Compute.evaluate = <T>(args):T[] | undefined => {
  const computation:Computation<T> = args.computation
  const storage:any[] = args.storage
  const by:number = args.by

  for (let ith = 0; ith < by; ith++) {
    let yielded = computation.next()

    if (yielded.done) {
      return storage
    } else {
      storage.push(yielded.value)
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

