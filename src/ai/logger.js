
const logger = {}

logger.data = (message, meta) => {
  const log = {
    message,
    meta,
    time: Date.now()
  }
}

module.exports = logger
