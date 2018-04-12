import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export default function getReportingFees(options, callback = logError) {
  return (dispatch, getState) => {
    augur.reporting.getReportingFees(options, (err, result) => {
      if (err) return callback(err)
      callback(null, result)
    })
  }
}
