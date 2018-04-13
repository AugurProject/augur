import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export default function getReportingFees(universe, reporter, callback = logError) {
  return (dispatch, getState) => {
    augur.augurNode.submitRequest(
      'getReportingFees',
      {
        universe,
        reporter,
      }, (err, result) => {
        if (err) return callback(err)
        callback(null, result)
      },
    )
  }
}
