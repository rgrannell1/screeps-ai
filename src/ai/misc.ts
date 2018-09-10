
import constants from './constants'

const misc = {} as any

misc.match = (value, opts) => {
  if (opts.hasOwnProperty(value)) {
    return opts[value](value)
  }
  if (opts.default) {
    return opts.default(value)
  }
}

misc.timer = (fn:Function, timer: number) => {
  if (Game.time % timer === 0) {
    fn()
  }
}

export default misc
