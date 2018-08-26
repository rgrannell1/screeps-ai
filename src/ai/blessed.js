
const blessed = {}

blessed.red = txt => `{red-fg}${txt}{/red-fg}`
blessed.blue = txt => `{blue-fg}${txt}{/blue-fg}`
blessed.green = txt => `{green-fg}${txt}{/green-fg}`

blessed.right = txt => `{right}${txt}{/right}`
blessed.left = txt => `{left}${txt}{/left}`

blessed.bold = txt => `{bold}${txt}{/bold}`

const exported = {log: {}}

Object.keys(blessed).forEach(method => {
  exported.log[method] = (...args) => {
    console.log(blessed[method](args))
  }
})

module.exports = exported
