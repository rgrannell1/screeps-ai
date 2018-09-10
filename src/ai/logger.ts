
import telemetry from './telemetry'

const logger = {} as any

logger.data = (message:string, label:string, meta:object) => {
  const data = {
    message,
    meta,
    time: Date.now(),
    tick: Game.time
  }

  console.log(`${label} ${JSON.stringify(data, null, 2)}`)
  telemetry.emit(label, data)
}

export default logger
