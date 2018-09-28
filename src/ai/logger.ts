
import telemetry from './telemetry'

const logger = {} as any

const RUN_ID = `screeps-${Date.now()}`

logger.data = (message:string, label:string, meta:object):void => {
  const data = {
    message,
    meta,
    time: Date.now(),
    tick: Game.time,
    run_id: RUN_ID
  }

  telemetry.emit(label, data)
}

export default logger
