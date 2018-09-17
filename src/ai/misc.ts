
import constants from './constants'

const misc = {} as any

misc.match = (value:any, opts:any):any => {
  if (opts.hasOwnProperty(value)) {
    return opts[value](value)
  }
  if (opts.default) {
    return opts.default(value)
  }
}

misc.timer = (fn:Function, timer: number):void => {
  if (Game.time % timer === 0) {
    fn()
  }
}

export default misc
