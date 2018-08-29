
const constants = require('./constants')
const misc = {}

misc.switch = (value, opts) => {
  if (opts.hasOwnProperty(value)) {
    return opts[value](value)
  }
  if (opts.default) {
    return opts.default(value)
  }
}

misc.timer = (fn, timer) => {
  if (Game.time % timer === 0) {
    fn()
  }
}

module.exports = misc
