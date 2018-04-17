export const DELETE_TRANSACTION = 'DELETE_TRANSACTION'
export const CLEAR_TRANSACTION_DATA = 'CLEAR_TRANSACTION_DATA'
export const DELETE_TRANSACTIONS_WITH_TRANSACTION_HASH = 'DELETE_TRANSACTIONS_WITH_TRANSACTION_HASH'

export const deleteTransaction = transactionId => ({ type: DELETE_TRANSACTION, transactionId })
export const deleteTransactionsWithTransactionHash = transactionHash => ({ type: DELETE_TRANSACTIONS_WITH_TRANSACTION_HASH, transactionHash })
export const clearTransactions = () => ({ type: CLEAR_TRANSACTION_DATA })
