import async from 'async'
import { augur, constants } from 'services/augurjs'
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
import { FUNDED_ACCOUNT, REGISTRATION, WITHDRAW, APPROVAL, TRANSFER, SENT_CASH } from 'modules/transactions/constants/types'
import logError from 'utils/log-error'

export function loadFundingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { branch, loginAccount } = getState()
    const params = {
      ...options,
      sender: loginAccount.address,
      branch: branch.id
    }
    if (!params.fromBlock && loginAccount.registerBlockNumber) {
      params.fromBlock = loginAccount.registerBlockNumber
    }
    async.eachLimit([
      FUNDED_ACCOUNT,
      REGISTRATION,
      'deposit',
      WITHDRAW,
      APPROVAL
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.logs.getLogsChunked({
        label,
        filter: label === FUNDED_ACCOUNT ? { ...params, fromBlock: null } : params,
        aux: null
      }, (logs) => {
        if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(label, logs))
      }, nextLabel)
    }, callback)
  }
}

export function loadTransferHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    const params = {
      ...options
    }
    if (!params.fromBlock && loginAccount.registerBlockNumber) {
      params.fromBlock = loginAccount.registerBlockNumber
    }
    async.eachLimit([
      TRANSFER,
      SENT_CASH
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.logs.getLogsChunked({
        label,
        filter: { ...params, _from: loginAccount.address },
        aux: null
      }, (logs) => {
        if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(label, logs))
      }, (err) => {
        augur.logs.getLogsChunked({
          label,
          filter: { ...params, _to: loginAccount.address },
          aux: null
        }, (logs) => {
          if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(label, logs))
        }, nextLabel)
      })
    }, callback)
  }
}
