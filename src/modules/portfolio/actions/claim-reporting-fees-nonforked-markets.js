import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export default function claimReportingFeesNonforkedMarkets(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    const options = {
      meta: loginAccount.meta,
      redeemer: loginAccount.address,
    }
    augur.reporting.claimReportingFeesNonforkedMarkets(options, (err, result) => {
      if (err) return callback(err)
      callback(null, result)
    })
  }
}
