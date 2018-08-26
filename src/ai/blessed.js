
const format = {}

format.red = txt => `{red-fg}${txt}{/red-fg}`
format.blue = txt => `{blue-fg}${txt}{/blue-fg}`
format.green = txt => `{green-fg}${txt}{/green-fg}`

format.right = txt => `{|}${txt}{/}`
format.left = txt => `{left}${txt}{/left}`
format.center = txt => `{center}${txt}{/center}`

format.bold = txt => `{bold}${txt}{/bold}`

const exported = {
  log: {}
}

Object.keys(format).forEach(method => {
  exported.log[method] = (...args) => {
    console.log(format[method](args))
  }
})

module.exports = {...exported, ...format}
