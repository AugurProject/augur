import { augur } from 'services/augurjs'
import { updateTransactionsData } from 'modules/transactions/actions/update-transactions-data'
import { deleteTransactionsWithTransactionHash } from 'modules/transactions/actions/delete-transaction'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { constructTransaction, constructBasicTransaction } from 'modules/transactions/actions/construct-transaction'
import logError from 'utils/log-error'

export const removeLogFromTransactions = log => (dispatch, getState) => {
  if (!log.transactionHash) return console.error(`transaction hash not found for log ${JSON.stringify(log)}`)
  dispatch(deleteTransactionsWithTransactionHash(log.transactionHash))
}

export const addLogToTransactions = (eventName, log, callback = logError) => (dispatch, getState) => {
  const hash = log.transactionHash
  if (!hash) return callback(`transaction hash not found for log ${JSON.stringify(log)}`)
  dispatch(constructTransaction(eventName, log, (err, transaction) => {
    if (err) return callback(err)
    if (transaction) {
      dispatch(updateTransactionsData({
        [transaction.id || hash]: {
          ...dispatch(constructBasicTransaction(hash, log.blockNumber, log.timestamp, gasFees)),
          ...transaction,
        },
      }))
      callback(null)
    }
  }))
}
