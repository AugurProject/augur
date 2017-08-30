import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import noop from 'utils/noop'

export const REGISTER_TO_REPORT = 'REGISTER_TO_REPORT'

export const registerToReport = (callback = logError) => (dispatch, getState) => {
  const { branch, loginAccount } = getState()
  augur.reporting.registerToReport({
    branchID: branch.id,
    _signer: loginAccount.privateKey,
    onSent: noop,
    onSuccess: (r) => {
      dispatch({ type: REGISTER_TO_REPORT, reportingWindow: branch.nextReportingWindowAddress })
      callback(null, r.callReturn)
    },
    onFailed: callback
  })
}
