
const deprecate = {} as any

deprecate.deprecate = (name:string) => {
  let err = new Error()
  Error.captureStackTrace(err)

  let stacks = err.stack.split('\n').slice(2)
  if (stacks) {
    const fn = stacks[0].slice(3)
    console.log(`deprecated ${stacks[0]}`)
  }
}

export default (deprecate)

