
const logger = {} as any

logger.data = (message, meta) => {
  const log = {
    message,
    meta,
    time: Date.now()
  }
}

export default logger
