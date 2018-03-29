import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export default function claimReportingFees(options, callback = logError) {
  return (dispatch, getState) => {
    augur.reporting.claimReportingFees(options, (result) => {
      callback(null, result.gasEstimates.totals.all.toString())
    })
  }
}
