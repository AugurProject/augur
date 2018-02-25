export const DELETE_TRANSACTION = 'DELETE_TRANSACTION'
export const CLEAR_TRANSACTION_DATA = 'CLEAR_TRANSACTION_DATA'

export function deleteTransaction(transactionId) {
  return { type: DELETE_TRANSACTION, transactionId }
}

export function clearTransactions() {
  return { type: CLEAR_TRANSACTION_DATA }
}
