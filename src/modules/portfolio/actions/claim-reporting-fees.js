import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export default function claimReportingFees(options, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    options.meta = loginAccount.meta
    options.redeemer = loginAccount.address
    augur.reporting.claimReportingFees(options, (err, result) => {
      if (err) return callback(err)
      callback(null, result)
    })
  }
}
