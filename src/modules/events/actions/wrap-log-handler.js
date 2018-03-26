import { defaultLogHandler } from 'modules/events/actions/default-log-handler'

export const wrapLogHandler = (logHandler = defaultLogHandler) => (dispatch, getState) => (err, log) => {
  if (err) return console.error(log.eventName, err, log)
  if (log) {
    console.info(`${new Date().toISOString()} LOG ${log.removed ? 'REMOVED' : 'ADDED'} ${log.eventName}`, log)
    const isInCurrentUniverse = getState().universe.id === log.universe
    if (isInCurrentUniverse) dispatch(logHandler(log))
  }
}
