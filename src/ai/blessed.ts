
const format = {} as any

format.red = (txt:string):string => {
  return `{red-fg}${txt}{/red-fg}`
}

format.blue = (txt:string):string => {
  return `{blue-fg}${txt}{/blue-fg}`
}

format.green = (txt:string):string => {
  return `{green-fg}${txt}{/green-fg}`
}


format.right = (txt:string):string => {
  return `{|}${txt}{/}`
}

format.left = (txt:string):string => {
  return `{left}${txt}{/left}`
}

format.center = (txt:string):string => {
  return `{center}${txt}{/center}`
}


format.bold = (txt:string):string => {
  return `{bold}${txt}{/bold}`
}

const exported = {
  log: {}
} as any

Object.keys(format).forEach(method => {
  exported.log[method] = (...args) => {
    console.log(format[method](args))
  }
})

export default {...exported, ...format}
