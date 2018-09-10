
import telemetry from './telemetry'

const logger = {} as any

logger.data = (message:string, label:string, meta:object) => {
  const data = {
    message,
    meta,
    time: Date.now(),
    tick: Game.time
  }

  telemetry.emit(label, data)
}

export default logger
