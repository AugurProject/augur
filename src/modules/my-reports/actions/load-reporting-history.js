import async from 'async'
import { augur, constants } from 'services/augurjs'
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
import { COLLECTED_FEES, PENALIZATION_CAUGHT_UP, PENALIZE, SUBMITTED_REPORT, SUBMITTED_REPORT_HASH, SLASHED_REP } from 'modules/transactions/constants/types'
import logError from 'utils/log-error'

export function loadReportingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { branch, loginAccount } = getState()
    const filter = {
      ...options,
      sender: loginAccount.address,
      branch: branch.id
    }
    if (!filter.fromBlock && loginAccount.registerBlockNumber) {
      filter.fromBlock = loginAccount.registerBlockNumber
    }
    async.eachLimit([
      COLLECTED_FEES,
      PENALIZATION_CAUGHT_UP,
      PENALIZE,
      SUBMITTED_REPORT,
      SUBMITTED_REPORT_HASH,
      SLASHED_REP
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.logs.getLogsChunked({ label, filter, aux: null }, (logs) => {
        if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(label, logs))
      }, nextLabel)
    }, (err) => {
      if (err) return callback(err)
      augur.logs.getLogsChunked({
        label: SLASHED_REP,
        filter: { ...filter, sender: null, reporter: loginAccount.address },
        aux: null
      }, (logs) => {
        if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(SLASHED_REP, logs))
      }, callback)
    })
  }
}
