import async from 'async'
import { augur, constants } from 'services/augurjs'
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
import { SUBMIT_REPORT } from 'modules/transactions/constants/types'
import logError from 'utils/log-error'

export function loadReportingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    const filter = {
      ...options,
      sender: loginAccount.address,
      universe: universe.id
    }
    async.eachLimit([
      SUBMIT_REPORT // TODO insert other reporting events here
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.logs.getLogsChunked({ label, filter, aux: null }, (logs) => {
        if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(label, logs))
      }, nextLabel)
    }, callback)
  }
}
