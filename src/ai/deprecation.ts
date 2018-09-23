
import {} from '../types'

const deprecate = {} as any

deprecate.deprecate = () => {
  try {
    throw new Error('')
  } catch (err) {
    console.log(`this function is deprecated\n: ${err.stack}`)
  }
}

export default deprecate

