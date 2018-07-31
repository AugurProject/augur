import { deleteTransactionsWithTransactionHash } from 'modules/transactions/actions/delete-transaction'
import { constructTransaction } from 'modules/transactions/actions/construct-transaction'

export const updateLoggedTransactions = log => (dispatch, getState) => {
  if (log.removed) {
    dispatch(removeLogFromTransactions(log))
  } else {
    dispatch(addLogToTransactions(log))
  }
}

export const removeLogFromTransactions = log => (dispatch, getState) => {
  if (!log.transactionHash) return console.error(`transaction hash not found for log ${JSON.stringify(log)}`)
  dispatch(deleteTransactionsWithTransactionHash(log.transactionHash))
}

export const addLogToTransactions = log => (dispatch, getState) => {
  if (!log.transactionHash) return console.error(`transaction hash not found for log ${JSON.stringify(log)}`)
  dispatch(constructTransaction(log))
}
