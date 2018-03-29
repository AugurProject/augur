import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export default function claimReportingFees(options, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    options.meta = loginAccount.meta
    // options.redeemer = "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb"
    options.redeemer = loginAccount.address
    augur.reporting.claimReportingFees(options, (result) => {
      callback(null, result)
    })
  }
}
