export const DELETE_TRANSACTION = 'DELETE_TRANSACTION'
export const CLEAR_TRANSACTION_DATA = 'CLEAR_TRANSACTION_DATA'

export function deleteTransaction(transactionID) {
  return { type: DELETE_TRANSACTION, transactionID }
}

export function clearTransactions() {
  return { type: CLEAR_TRANSACTION_DATA }
}
