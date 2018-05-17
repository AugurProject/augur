import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export default function claimReportingFeesForkedMarket(options, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    const payload = {
      ...options,
      meta: loginAccount.meta,
      redeemer: loginAccount.address,
    }
    augur.reporting.claimReportingFeesForkedMarket(payload, (err, result) => {
      if (err) return callback(err)
      callback(null, result)
    })
  }
}
