import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import noop from 'utils/noop'

export const REGISTER_TO_REPORT = 'REGISTER_TO_REPORT'

export const registerToReport = (callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  augur.reporting.registerToReport({
    universeID: universe.id,
    meta: loginAccount.meta,
    onSent: noop,
    onSuccess: (r) => {
      dispatch({ type: REGISTER_TO_REPORT, reportingWindow: universe.nextReportingWindowAddress })
      callback(null, r.callReturn)
    },
    onFailed: callback
  })
}
